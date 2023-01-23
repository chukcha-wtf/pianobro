import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { v4 as uuidv4 } from 'uuid';

export const QUOTES = [
  {
    uuid: uuidv4(),
    quote: "The piano ain’t got no wrong notes.",
    author: "Thelonious Monk",
  },
  {
    uuid: uuidv4(),
    quote: "The piano is the most beautiful instrument in the world. It is the only instrument that can sing.",
    author: "Maurice Ravel",
  },
  {
    uuid: uuidv4(),
    quote: "An amateur practices until he can do a thing right, a professional until he can’t do it wrong.",
    author: "Percy C. Buck",
  },
  {
    uuid: uuidv4(),
    quote: "The secret of getting ahead is getting started. The secret of getting started is breaking your complex, overwhelming tasks into small manageable tasks, then starting on the first one.",
    author: "Mark Twain",
  },
  {
    uuid: uuidv4(),
    quote: "Whether you think you can or think you can't, you are right.",
    author: "Henry Ford",
  },
  {
    uuid: uuidv4(),
    quote: "When you play, never mind who listens to you.",
    author: "Robert Schumann",
  },
  {
    uuid: uuidv4(),
    quote: "The piano keys are black and white but they sound like a million colors in your mind.",
    author: "Maria Cristina Mena",
  },
  {
    uuid: uuidv4(),
    quote: "The notes I handle no better than many pianists. But the pauses between the notes - ah, that is where the art resides!",
    author: "Artur Schnabel",
  },
  {
    uuid: uuidv4(),
    quote: "The music is not in the notes, but in the silence in between.",
    author: "Wolfgang Amadeus Mozart",
  },
  {
    uuid: uuidv4(),
    quote: "There are eighty-eight keys on a piano and within that, an entire universe.",
    author: "James Rhodes",
  },
  {
    uuid: uuidv4(),
    quote: "To play a wrong note is insignificant; to play without passion is inexcusable.",
    author: "Ludwig van Beethoven",
  },
  {
    uuid: uuidv4(),
    quote: "Have I a secret about playing the piano? It is a very simple one. I sit down on the piano-stool and make myself comfortable - and I always make sure that the lid over the keyboard is open before I start to play.",
    author: "Artur Schnabel",
  },
  {
    uuid: uuidv4(),
    quote: "There's nothing remarkable about it. All one has to do is hit the right keys at the right time and the instrument plays itself.",
    author: "Johann Sebastian Bach",
  },
  {
    uuid: uuidv4(),
    quote: "One of my biggest thrills for me still is sitting down with a guitar or a piano and just out of nowhere trying to make a song happen.",
    author: "Paul McCartney",
  },
  {
    uuid: uuidv4(),
    quote: "I’m an interpreter of stories. When I perform it’s like sitting down at my piano and telling fairy stories.",
    author: "Nat King Cole",
  },
]

export const PianoQuoteModel = types
  .model("PianoQuote")
  .props({
    uuid: types.identifier,
    quote: "",
    author: "",
  })

export interface PracticeSession extends Instance<typeof PianoQuoteModel> {}
export interface PracticeSessionSnapshotOut extends SnapshotOut<typeof PianoQuoteModel> {}
export interface PracticeSessionSnapshotIn extends SnapshotIn<typeof PianoQuoteModel> {}
