import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { motion } from 'framer-motion';
import { rtdb } from '../lib/firebase';
import GameCard from '../components/GameCard';
import { useAuth } from '../contexts/AuthContext';
import { loadMyValidatedHand, INCOMPLETE_AUCTION_MESSAGE } from '../utils/cardBattleSquads';
import {
  STATS,
  toArray,
  activeCountOf,
  cardFromPlayerId,
  buildBattleFromPublic,
  createBattle,
  updateBattle,
  chooseMode,
  pickCard,
  submitCard,
  advance,
  needsAdvance,
  rematchBattle,
} from '../utils/cardBattle';

const REVIEW_SECONDS = 10;

const Shell = ({ children }) => (
  <div className="min-h-screen bg-[#050505] text-white font-sans p-4 sm:p-6 relative overflow-hidden">
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
    </div>
    <div className="relative z-10 max-w-7xl mx-auto">{children}</div>
  </div>
);

const Spinner = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
    />
  </div>
);

const Message = ({ title, text, onBack }) => (
  <Shell>
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center text-white">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-gray-300 max-w-xl mb-8">{text}</p>
      {onBack && (
        <button onClick={onBack} className="bg-blue-500 px-6 py-3 rounded-lg font-bold">
          Back to Home
        </button>
      )}
    </div>
  </Shell>
);

const CardGrid = ({ cards, selectedId, onSelect }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
    {cards.map((c) => (
      <GameCard
        key={c.id}
        card={c}
        interactive
        selected={c.id === selectedId}
        onClick={() => onSelect(c)}
      />
    ))}
  </div>
);

const GameRoom = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const uid = user?.uid;

  const [setup, setSetup] = useState({ status: 'loading', errors: [], myHand: null, squadLimit: 0 });
  const [hostId, setHostId] = useState(null);
  const [battle, setBattle] = useState(undefined); // undefined = loading, null = not created
  const [now, setNow] = useState(Date.now());
  const [reviewLeft, setReviewLeft] = useState(REVIEW_SECONDS);
  const [reviewDone, setReviewDone] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const offsetRef = useRef(0);
  const battleRef = useRef(undefined);
  const creatingRef = useRef(false);
  battleRef.current = battle;

  const serverNow = () => Date.now() + offsetRef.current;

  // 1. This franchise's own validated hand (review screen)
  useEffect(() => {
    if (!uid) return;
    let cancelled = false;

    loadMyValidatedHand(auctionId, uid)
      .then((result) => {
        if (cancelled) return;
        if (result.ok) {
          setSetup({ status: 'ready', errors: [], myHand: result, squadLimit: result.squadLimit });
        } else {
          setSetup({ status: 'invalid', errors: result.errors, myHand: null, squadLimit: result.squadLimit || 0 });
        }
      })
      .catch((err) => {
        if (!cancelled) setSetup({ status: 'invalid', errors: [err.message], myHand: null, squadLimit: 0 });
      });

    return () => {
      cancelled = true;
    };
  }, [auctionId, uid]);

  // 2. Server clock offset, so every client uses the same deadlines
  useEffect(() => {
    return onValue(ref(rtdb, '.info/serverTimeOffset'), (snap) => {
      offsetRef.current = snap.val() || 0;
    });
  }, []);

  // 3. Host id and the live battle
  useEffect(() => {
    const unsubHost = onValue(ref(rtdb, `auctions/${auctionId}/room/hostId`), (snap) =>
      setHostId(snap.val())
    );
    const unsubBattle = onValue(ref(rtdb, `auctions/${auctionId}/battle`), (snap) =>
      setBattle(snap.exists() ? snap.val() : null)
    );
    return () => {
      unsubHost();
      unsubBattle();
    };
  }, [auctionId]);

  // 4. Clock tick (drives countdowns and timeouts)
  useEffect(() => {
    const t = setInterval(() => setNow(serverNow()), 500);
    return () => clearInterval(t);
  }, []);

  // 5. Review countdown (10 seconds)
  useEffect(() => {
    if (setup.status !== 'ready') return;
    if (reviewLeft <= 0) {
      setReviewDone(true);
      return;
    }
    const t = setTimeout(() => setReviewLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [setup.status, reviewLeft]);

  const isHost = !!uid && hostId === uid;
    // 6. Any franchise on the review screen creates the battle if it doesn't exist.
  // createBattle is a transaction, so only the first write is accepted.
  useEffect(() => {
    if (!reviewDone || battle !== null || creatingRef.current) return;
    creatingRef.current = true;

    buildBattleFromPublic(auctionId)
      .then(async (data) => {
        if (!data) {
          setNotice('Squads are not published yet. Open the summary page once, then refresh.');
          creatingRef.current = false;
          return;
        }
        const committed = await createBattle(auctionId, data);
        if (!committed) creatingRef.current = false;
      })
            .catch((e) => {
        console.error('BATTLE CREATE FAILED:', e);
        setNotice(e.message);
        creatingRef.current = false;
      });
  }, [reviewDone, battle, auctionId]);
  // 7. Timeouts and completed rounds. Any client can trigger; the transaction makes it safe.
  useEffect(() => {
    const b = battleRef.current;
    if (!b || !needsAdvance(b, serverNow())) return;
    updateBattle(auctionId, (cur) => advance(cur, serverNow())).catch(() => {});
  }, [now, auctionId]);

  // Runs a player action through the shared transaction
  const run = async (fn) => {
    if (busy) return;
    setBusy(true);
    setNotice('');
    try {
      const res = await updateBattle(auctionId, fn);
      if (!res.committed) setNotice('That move was not accepted. Please try again.');
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  };

  const doMode = (mode) => run((b) => chooseMode(b, mode, serverNow()));
  const doPick = (cardId, stat) => {
    setSelectedCardId(null);
    return run((b) => pickCard(b, uid, cardId, stat, serverNow()));
  };
  const doSubmit = (cardId) => run((b) => submitCard(b, uid, cardId, serverNow()));

  // Derived values (all hooks are above the early returns)
  const myCards = setup.myHand?.cards || [];
  const priceById = useMemo(
    () => Object.fromEntries(myCards.map((c) => [c.id, c.draftedPrice])),
    [myCards]
  );
  const doRematch = async () => {
    if (busy) return;
    setBusy(true);
    setNotice('');
    try {
      const res = await rematchBattle(auctionId, serverNow());
      if (!res.committed) setNotice('A rematch has already started, or the squads are missing.');
    } catch (e) {
      setNotice(e.message);
    } finally {
      setBusy(false);
    }
  };
  const activeIds = battle ? toArray(battle.active?.[uid]) : [];
  const myActive = activeIds
    .map((id) => cardFromPlayerId(id, priceById[id] ?? null))
    .filter(Boolean);
  const selectedCard = myActive.find((c) => c.id === selectedCardId) || null;

  const inGame = !!battle && toArray(battle.turnOrder).includes(uid);
  const isMyTurn = battle?.phase === 'pick' && battle.turnUid === uid;
  const isSubmitPhase = battle?.phase === 'submit';
  const iAlreadyLocked = isSubmitPhase && !!battle.submissions?.[uid];
  const canSubmit = isSubmitPhase && inGame && !iAlreadyLocked && activeIds.length > 0;
  const secondsLeft = battle?.deadline ? Math.max(0, Math.ceil((battle.deadline - now) / 1000)) : 0;
  const lockedCount = battle ? Object.keys(battle.submissions || {}).length : 0;
  const playingCount = battle ? toArray(battle.turnOrder).filter((u) => activeCountOf(battle, u) > 0).length : 0;

  // RENDER: early states
  if (setup.status === 'loading') return <Spinner />;

  if (setup.status === 'invalid') {
    return (
      <Message
        title="Card Battle Unavailable"
        text={`${INCOMPLETE_AUCTION_MESSAGE} ${setup.errors.join(' ')}`}
        onBack={() => navigate('/')}
      />
    );
  }

  // RENDER: private 10-second squad review (own cards only)
  if (!reviewDone) {
    return (
      <Shell>
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Your Squad 🎴</h1>
          <p className="text-gray-300">{setup.myHand?.teamName}</p>
          <p className="text-gray-400 mt-2">Battle setup in {reviewLeft}s</p>
        </div>
        <CardGrid cards={myCards} selectedId={null} onSelect={() => {}} />
      </Shell>
    );
  }

  if (battle === undefined) return <Spinner />;

    if (battle === null) {
    return (
      <Message
        title="Preparing the battle"
        text={notice || 'Every franchise has finished the review. Creating the battle now...'}
      />
    );
  }

  // RENDER: host chooses the shared format
  if (battle.phase === 'mode_select') {
    return (
      <Shell>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-8">Choose Battle Format</h1>
          {isHost ? (
            <div className="space-y-4">
              <button
                disabled={busy}
                onClick={() => doMode('elimination')}
                className="w-full bg-blue-600 hover:bg-yellow-500 disabled:opacity-50 text-white font-bold py-4 rounded-lg"
              >
                Play until cards run out
                <span className="block text-sm font-normal text-gray-200">Most cards collected wins</span>
              </button>
              <button
                disabled={busy}
                onClick={() => doMode('best5')}
                className="w-full bg-blue-600 hover:bg-yellow-500 disabled:opacity-50 text-white font-bold py-4 rounded-lg"
              >
                Best of 5 rounds
              </button>
              <button
                disabled={busy}
                onClick={() => doMode('best10')}
                className="w-full bg-blue-600 hover:bg-yellow-500 disabled:opacity-50 text-white font-bold py-4 rounded-lg"
              >
                Best of 10 rounds
              </button>
              {notice && <p className="text-red-400 text-sm">{notice}</p>}
            </div>
          ) : (
            <p className="text-gray-300">Waiting for the host to choose the format...</p>
          )}
        </div>
      </Shell>
    );
  }

  // RENDER: final results
  if (battle.phase === 'finished') {
    const ranking = toArray(battle.result?.ranking);
    const winnerName = battle.names?.[battle.result?.winnerUid] || 'Nobody';
    return (
      <Shell>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">🏆 Battle Complete</h1>
          <p className="text-2xl text-white">{winnerName} wins!</p>
        </div>
        <div className="max-w-3xl mx-auto bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          {ranking.map((row, i) => (
            <div
              key={row.uid}
              className={`grid grid-cols-5 gap-2 p-4 text-sm items-center ${
                i === 0 ? 'bg-yellow-500/10' : ''
              } ${i > 0 ? 'border-t border-white/5' : ''}`}
            >
              <span className="text-gray-400 font-bold">#{i + 1}</span>
              <span className="text-white font-bold col-span-2 truncate">{row.name}</span>
              <span className="text-gray-300 text-center">Won {row.roundsWon}</span>
              <span className="text-yellow-500 font-black text-center">{row.collected} cards</span>
            </div>
          ))}
        </div>
                <div className="text-center mt-8 space-y-4">
          <button
            onClick={doRematch}
            disabled={busy}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black px-8 py-3 rounded-lg font-black"
          >
            Rematch (same rules)
          </button>
          <div>
            <button onClick={() => navigate('/')} className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold">
              Back to Home
            </button>
          </div>
          {notice && <p className="text-red-400 text-sm">{notice}</p>}
        </div>
      </Shell>
    );
  }

  // RENDER: live battle
  const phaseText =
    battle.phase === 'pick'
      ? isMyTurn
        ? `Your turn · pick a card and a stat · ${secondsLeft}s`
        : `Waiting for ${battle.names?.[battle.turnUid] || 'turn holder'} · ${secondsLeft}s`
      : `Stat: ${battle.stat} · ${secondsLeft}s to lock in`;

  const last = battle.lastRound;

  return (
    <Shell>
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-white">⚡ Card Battle</h1>
        <p className="text-gray-400 mt-1">
          Round {battle.round}
          {battle.maxRounds ? ` / ${battle.maxRounds}` : ''} · {battle.mode}
        </p>
        <p className="text-yellow-400 font-bold mt-2">{phaseText}</p>
      </div>

      {/* Scoreboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {toArray(battle.turnOrder).map((u) => {
          const isTurn = battle.phase === 'pick' && battle.turnUid === u;
          return (
            <div
              key={u}
              className={`p-3 rounded-xl border ${
                isTurn ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 bg-white/[0.03]'
              } ${u === uid ? 'ring-1 ring-yellow-500/60' : ''}`}
            >
              <p className="text-white font-black text-sm truncate">{battle.teamIds?.[u]}</p>
              <p className="text-[10px] text-gray-400 truncate">{battle.names?.[u]}</p>
              <div className="grid grid-cols-3 gap-1 mt-2 text-center">
                <div>
                  <span className="block text-[8px] text-gray-500 uppercase">Cards</span>
                  <span className="font-bold text-white">{activeCountOf(battle, u)}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-gray-500 uppercase">Won</span>
                  <span className="font-bold text-white">{battle.roundsWon?.[u] || 0}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-gray-500 uppercase">Collected</span>
                  <span className="font-bold text-yellow-500">{toArray(battle.collected?.[u]).length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Last round reveal */}
      {last && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-6">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
            Round {last.round} · {last.stat} revealed
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {Object.entries(last.plays || {}).map(([u, p]) => (
              <div
                key={u}
                className={`p-3 rounded-lg border ${
                  u === last.winnerUid ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10'
                }`}
              >
                <p className="text-xs text-gray-400 truncate">{battle.names?.[u]}</p>
                <p className="text-sm font-bold text-white truncate">{p.name}</p>
                <p className="text-lg font-black text-yellow-500">{p.value ?? '-'}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-yellow-400 mt-3">Round winner: {battle.names?.[last.winnerUid]}</p>
        </div>
      )}

      {/* Your actions */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6">
                {isMyTurn && (
          <>
            <p className="text-white font-bold mb-3">
              {selectedCard ? `Pick a stat for ${selectedCard.name}` : 'Step 1: tap a card, then pick its stat'}
            </p>

            {/* Stat row sits ABOVE the cards */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
              {STATS.map((st) => (
                <button
                  key={st}
                  disabled={busy || !selectedCard}
                  onClick={() => doPick(selectedCard.id, st)}
                  className="p-3 rounded-xl bg-[#efb100]/10 border border-yellow-500/40 hover:bg-yellow-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <span className="block text-[9px] text-gray-400 font-black uppercase tracking-widest">{st}</span>
                  <span className="text-lg font-black text-yellow-500">
                    {selectedCard?.stats?.[st.toLowerCase()] ?? '-'}
                  </span>
                </button>
              ))}
            </div>

            <CardGrid cards={myActive} selectedId={selectedCardId} onSelect={(c) => setSelectedCardId(c.id)} />
          </>
        )}
        {canSubmit && (
          <>
            <p className="text-white font-bold mb-1">
              Stat announced: <span className="text-yellow-400">{battle.stat}</span>
            </p>
            <p className="text-gray-300 mb-3">Choose your best card for {battle.stat}</p>
            <CardGrid cards={myActive} selectedId={null} onSelect={(c) => doSubmit(c.id)} />
          </>
        )}

        {iAlreadyLocked && (
          <p className="text-center text-gray-300 py-6">
            Card locked in. Waiting for others ({lockedCount}/{playingCount})
          </p>
        )}

        {!isMyTurn && !canSubmit && !iAlreadyLocked && (
          <p className="text-center text-gray-400 py-6">
            {inGame && activeIds.length === 0 ? 'Your cards are finished. Watching the battle.' : 'Watching this round.'}
          </p>
        )}

        {notice && <p className="text-red-400 text-sm mt-4">{notice}</p>}
      </div>
    </Shell>
  );
};

export default GameRoom;