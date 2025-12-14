import Dexie, { type Table } from "dexie";

export type Deck = {
  id: string;
  name: string;
  createdAt: number;
};

export type Card = {
  id: string;
  deckId: string;

  front: string;
  back: string;
  tags: string[];

  // SRS fields
  interval: number; // days
  repetition: number; // times answered successfully
  easeFactor: number; // default starts at 2.5
  nextReview: number; // timestamp (ms)
  lastReviewed: number | null;

  createdAt: number;
  updatedAt: number;
};

export class RevueDB extends Dexie {
  decks!: Table<Deck, string>;
  cards!: Table<Card, string>;

  constructor() {
    super("revue");

    this.version(1).stores({
      decks: "id, name, createdAt",
      cards: "id, deckId, nextReview, updatedAt",
    });
  }
}

export const db = new RevueDB();
