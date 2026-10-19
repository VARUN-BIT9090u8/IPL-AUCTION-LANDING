import { get, ref, set, runTransaction } from 'firebase/database';
import { rtdb } from '../lib/firebase';
import { IPL_PLAYERS } from '../data/players';

export const STATS = ['RUNS', 'WICKETS', 'SR', 'AVG', 'ECON'];
export const MODE_ROUNDS = { elimination: null, best5: 5, best10: 10 };
export const PICK_MS = 20000;
export const SUBMIT_MS = 20000;

const LOWER_WINS = { ECON: true };

// Firebase can return arrays as objects. This always returns an array.
export const toArray = (v) => {
  if (Array.isArray(v)) return v;
  if (v && typeof v === 'object') return Object.values(v);
  return [];
};

export const cardFromPlayerId = (id, draftedPrice = null) => {
  const p = IPL_PLAYERS.find((x) => x.id === id);
  if (!p) return null;
  const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
  return {
    id: p.id,
    name: p.name,
    role: p.role,
    country: p.country,
    image: p.image,
    draftedPrice,
    stats: {
      matches: num(p.stats?.matches),
      runs: num(p.stats?.runs),
      wickets: num(p.stats?.wickets),
      sr: num(p.stats?.sr),
      avg: num(p.stats?.avg),
      econ: num(p.stats?.econ),
    },
  };
};

const statValue = (card, stat) => {
  const v = card?.stats?.[stat.toLowerCase()];
  return typeof v === 'number' ? v : null;
};

// Higher score wins. A missing value never wins.
const scoreOf = (card, stat) => {
  const v = statValue(card, stat);
  if (v === null) return -Infinity;
  return LOWER_WINS[stat] ? -v : v;
};

export const activeCountOf = (b, uid) => toArray(b.active?.[uid]).length;
const activeOf = (b, uid) => toArray(b.active?.[uid]);
const participants = (b) => b.turnOrder.filter((uid) => activeCountOf(b, uid) > 0);
const firstCard = (b, uid) => [...activeOf(b, uid)].sort()[0] ?? null;

const nextTurn = (b, fromUid) => {
  const order = b.turnOrder;
  const start = order.indexOf(fromUid);
  for (let i = 1; i <= order.length; i++) {
    const uid = order[(start + i + order.length) % order.length];
    if (activeCountOf(b, uid) > 0) return uid;
  }
  return null;
};

const computeResult = (b) => {
  const rows = b.turnOrder.map((uid, idx) => ({
    uid,
    idx,
    name: b.names?.[uid] || uid,
    teamId: b.teamIds?.[uid] || '',
    collected: toArray(b.collected?.[uid]).length,
    roundsWon: b.roundsWon?.[uid] || 0,
    cardsLeft: activeCountOf(b, uid),
  }));
  rows.sort(
    (x, y) => y.collected - x.collected || y.roundsWon - x.roundsWon || x.idx - y.idx
  );
  return { winnerUid: rows[0]?.uid ?? null, ranking: rows };
};

const norm = (b) => ({ ...b, turnOrder: toArray(b.turnOrder) });

// Builds the starting battle from the host's published squads.
export const initBattleData = ({ turnOrder, names, teamIds, squads }) => {
  const active = {};
  const collected = {};
  const roundsWon = {};
  turnOrder.forEach((uid) => {
    active[uid] = squads[uid].map((s) => s.id);
    collected[uid] = [];
    roundsWon[uid] = 0;
  });
  return {
    phase: 'mode_select',
    mode: null,
    round: 1,
    roundsPlayed: 0,
    turnOrder,
    names,
    teamIds,
    turnUid: null,
    stat: null,
    deadline: 0,
    submissions: {},
    active,
    collected,
    roundsWon,
    lastRound: null,
    result: null,
  };
};

export const chooseMode = (b, mode, now) => {
  if (b.phase !== 'mode_select' || !(mode in MODE_ROUNDS)) return null;
  const first = participants(b)[0];
  if (!first) return null;
  return {
    ...b,
    mode,
    maxRounds: MODE_ROUNDS[mode],
    phase: 'pick',
    turnUid: first,
    deadline: now + PICK_MS,
  };
};

const commitPick = (b, uid, cardId, stat, now) => ({
  ...b,
  phase: 'submit',
  stat,
  submissions: { [uid]: cardId },
  deadline: now + SUBMIT_MS,
});

export const pickCard = (b, uid, cardId, stat, now) => {
  if (b.phase !== 'pick' || uid !== b.turnUid) return null;
  if (!STATS.includes(stat) || !activeOf(b, uid).includes(cardId)) return null;
  return commitPick(b, uid, cardId, stat, now);
};

export const submitCard = (b, uid, cardId, now) => {
  if (b.phase !== 'submit' || !participants(b).includes(uid)) return null;
  if (b.submissions?.[uid]) return null;
  if (!activeOf(b, uid).includes(cardId)) return null;
  return { ...b, submissions: { ...(b.submissions || {}), [uid]: cardId } };
};

export const needsAdvance = (b, now) => {
  if (!b) return false;
  if (b.phase === 'pick') return !!b.deadline && now > b.deadline;
  if (b.phase === 'submit') {
    const pending = participants(b).filter((uid) => !b.submissions?.[uid]);
    return pending.length === 0 || now > b.deadline;
  }
  return false;
};

const resolveRound = (b, now) => {
  const plays = b.submissions || {};
  const stat = b.stat;

  const cards = {};
  const values = {};
  Object.entries(plays).forEach(([uid, cardId]) => {
    cards[uid] = cardFromPlayerId(cardId);
    values[uid] = statValue(cards[uid], stat);
  });

  // Deterministic tie-break: starting from the turn holder, the earliest franchise wins ties
  const start = Math.max(0, b.turnOrder.indexOf(b.turnUid));
  const order = [...b.turnOrder.slice(start), ...b.turnOrder.slice(0, start)].filter(
    (uid) => plays[uid]
  );
  let winnerUid = order[0];
  let best = -Infinity;
  order.forEach((uid) => {
    const s = scoreOf(cards[uid], stat);
    if (s > best) {
      best = s;
      winnerUid = uid;
    }
  });

  const active = { ...b.active };
  const collected = { ...b.collected };
  const roundsWon = { ...b.roundsWon };

  Object.entries(plays).forEach(([uid, cardId]) => {
    active[uid] = activeOf(b, uid).filter((id) => id !== cardId);
  });
  collected[winnerUid] = [...toArray(b.collected?.[winnerUid]), ...Object.values(plays)];
  roundsWon[winnerUid] = (roundsWon[winnerUid] || 0) + 1;

  const roundsPlayed = b.roundsPlayed + 1;
  const next = {
    ...b,
    active,
    collected,
    roundsWon,
    roundsPlayed,
    round: b.round + 1,
    stat: null,
    submissions: {},
    lastRound: {
      round: b.round,
      stat,
      turnUid: b.turnUid,
      winnerUid,
      plays: Object.fromEntries(
        Object.entries(plays).map(([uid, cardId]) => [
          uid,
          { cardId, name: cards[uid]?.name || cardId, value: values[uid] },
        ])
      ),
    },
  };

  const limitReached = typeof b.maxRounds === 'number' && roundsPlayed >= b.maxRounds;
  if (limitReached || participants(next).length < 2) {
    return { ...next, phase: 'finished', turnUid: null, deadline: 0, result: computeResult(next) };
  }

  return {
    ...next,
    phase: 'pick',
    turnUid: nextTurn(next, b.turnUid),
    deadline: now + PICK_MS,
  };
};

// Handles timeouts and completed rounds. Returns null when nothing should change.
export const advance = (b, now) => {
  if (!needsAdvance(b, now)) return null;

  if (b.phase === 'pick') {
    const cardId = firstCard(b, b.turnUid);
    return cardId ? commitPick(b, b.turnUid, cardId, 'RUNS', now) : null;
  }

  const subs = { ...(b.submissions || {}) };
  participants(b).forEach((uid) => {
    if (!subs[uid]) subs[uid] = firstCard(b, uid);
  });
  return resolveRound({ ...b, submissions: subs }, now);
};

// Every battle change goes through here, so changes are applied atomically.
// Returning null/undefined from fn aborts the change.
export const updateBattle = (auctionId, fn) =>
  runTransaction(ref(rtdb, `auctions/${auctionId}/battle`), (current) => {
    if (current === null) return undefined;
    const next = fn(norm(current));
    return next || undefined;
  });

// Creates the battle only if none exists yet.
export const createBattle = async (auctionId, data) => {
  const res = await runTransaction(ref(rtdb, `auctions/${auctionId}/battle`), (current) =>
    current === null ? data : undefined
  );
  return res.committed;
};
// Reads the published squads. If they are missing (rooms completed before
// publicSquads existed), copies the existing hands into publicSquads first.
export const buildBattleFromPublic = async (auctionId) => {
  let snap = await get(ref(rtdb, `auctions/${auctionId}/publicSquads`));

  // Auctions completed before publicSquads existed: copy the private hands once
  if (!snap.exists()) {
    const handsSnap = await get(ref(rtdb, `auctions/${auctionId}/hands`));
    if (!handsSnap.exists()) return null;
    await set(ref(rtdb, `auctions/${auctionId}/publicSquads`), handsSnap.val());
    snap = await get(ref(rtdb, `auctions/${auctionId}/publicSquads`));
  }

  if (!snap.exists()) return null;

  const pub = snap.val();
  const turnOrder = Object.keys(pub);
  const squads = {};
  const names = {};
  const teamIds = {};

  turnOrder.forEach((uid) => {
    squads[uid] = toArray(pub[uid].squad);
    names[uid] = pub[uid].teamName || pub[uid].teamId || uid;
    teamIds[uid] = pub[uid].teamId || '';
  });

  return initBattleData({ turnOrder, names, teamIds, squads });
};
// Starts a new battle with the same squads and format. Any franchise can trigger it
// after the battle finishes. The transaction makes sure only one rematch is accepted.
export const rematchBattle = async (auctionId, now) => {
  const fresh = await buildBattleFromPublic(auctionId);
  if (!fresh) return { committed: false };

  return runTransaction(ref(rtdb, `auctions/${auctionId}/battle`), (cur) => {
    if (!cur || cur.phase !== 'finished') return undefined; // already rematched or still running

    const started = chooseMode({ ...fresh }, cur.mode, now);
    if (!started) return undefined;

    return {
      ...started,
      rematchCount: (cur.rematchCount || 0) + 1,
    };
  });
};