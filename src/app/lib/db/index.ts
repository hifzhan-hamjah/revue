import { db, type Card, type Deck } from "./schema";

export function uid(prefix = "") {
  return `${prefix}${crypto.randomUUID()}`;
}

/** Decks */
export async function createDeck(name: string): Promise<Deck> {
  const deck: Deck = {
    id: uid("deck_"),
    name: name.trim(),
    createdAt: Date.now(),
  };
  await db.decks.add(deck);
  return deck;
}

export async function listDecks(): Promise<Deck[]> {
  return db.decks.orderBy("createdAt").reverse().toArray();
}

export async function getDeck(deckId: string): Promise<Deck | undefined> {
  return db.decks.get(deckId);
}

export async function deleteDeck(deckId: string): Promise<void> {
  await db.transaction("rw", db.decks, db.cards, async () => {
    await db.decks.delete(deckId);
    await db.cards.where("deckId").equals(deckId).delete();
  });
}

/** Cards */
export async function addCard(input: {
  deckId: string;
  front: string;
  back: string;
  tags?: string[];
}): Promise<Card> {
  const now = Date.now();
  const card: Card = {
    id: uid("card_"),
    deckId: input.deckId,
    front: input.front.trim(),
    back: input.back.trim(),
    tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean),

    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    nextReview: now, // new cards are due immediately
    lastReviewed: null,

    createdAt: now,
    updatedAt: now,
  };

  await db.cards.add(card);
  return card;
}

export async function listCardsByDeck(deckId: string): Promise<Card[]> {
  return db.cards.where("deckId").equals(deckId).sortBy("createdAt");
}

export async function getDueCards(limit = 50): Promise<Card[]> {
  const now = Date.now();
  return db.cards.where("nextReview").belowOrEqual(now).limit(limit).toArray();
}

export async function updateCard(cardId: string, patch: Partial<Card>) {
  await db.cards.update(cardId, { ...patch, updatedAt: Date.now() });
}

export async function countDueCards(): Promise<number> {
  const now = Date.now();
  return db.cards.where("nextReview").belowOrEqual(now).count();
}
