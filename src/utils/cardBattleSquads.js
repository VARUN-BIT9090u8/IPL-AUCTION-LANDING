import { get, ref } from 'firebase/database';
import { rtdb } from '../lib/firebase';
import { IPL_PLAYERS } from '../data/players';

export const INCOMPLETE_AUCTION_MESSAGE =
  'The auction is not complete or some franchises have insufficient players. Please complete the auction before starting Card Battle.';

export const SQUAD_LIMITS = { mega: 25, sprint11: 11, sprint5: 5 };

const toStat = (value) =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const buildCard = (player, draftedPrice) => ({
  id: player.id,
  name: player.name,
  role: player.role,
  type: player.type,
  country: player.country,
  image: player.image,
  draftedPrice,
  stats: {
    runs: toStat(player.stats?.runs),
    wickets: toStat(player.stats?.wickets),
    sr: toStat(player.stats?.sr),
    avg: toStat(player.stats?.avg),
    econ: toStat(player.stats?.econ),
  },
});

const fail = (errors) => ({
  ok: false,
  errors,
  message: INCOMPLETE_AUCTION_MESSAGE,
});

/**
 * Loads the logged-in franchise's own validated hand.
 * Reads only: room, public validation summary, and this user's hand.
 * Returns { ok: true, teamName, cards, squadLimit } or { ok: false, errors, message }.
 */
export const loadMyValidatedHand = async (auctionId, uid) => {
  const [roomSnap, validationSnap, handSnap] = await Promise.all([
    get(ref(rtdb, `auctions/${auctionId}/room`)),
    get(ref(rtdb, `auctions/${auctionId}/validation`)),
    get(ref(rtdb, `auctions/${auctionId}/hands/${uid}`)),
  ]);

  if (!roomSnap.exists()) return fail(['Auction room not found.']);

  const room = roomSnap.val();
  const errors = [];

  if (room.status !== 'completed') {
    errors.push(`Auction status is "${room.status}", not "completed".`);
  }

  const squadLimit = SQUAD_LIMITS[room.auctionType];
  if (!squadLimit) {
    errors.push(`Unknown auction type: "${room.auctionType}".`);
  }

  if (!validationSnap.exists()) {
    errors.push('Squad validation has not been published yet.');
  } else if (!validationSnap.val().ok) {
    errors.push(...(validationSnap.val().errors || ['Squads failed validation.']));
  }

  if (!handSnap.exists()) {
    errors.push('No squad was found for your franchise in this auction.');
  }

  if (errors.length > 0) return { ...fail(errors), squadLimit: squadLimit || 0 };

  const hand = handSnap.val();
  const seen = new Set();
  const cards = [];

  (hand.squad || []).forEach((entry) => {
    const player = IPL_PLAYERS.find((p) => p.id === entry.id);
    if (!player || seen.has(entry.id)) return;
    seen.add(entry.id);
    cards.push(buildCard(player, Number(entry.bid)));
  });

  if (cards.length !== squadLimit) {
    return {
      ...fail([`Your squad has ${cards.length}/${squadLimit} valid players.`]),
      squadLimit,
    };
  }

  return {
    ok: true,
    squadLimit,
    teamName: hand.teamName || hand.teamId,
    cards,
  };
};