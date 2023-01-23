import { Instance, SnapshotOut, types } from "mobx-state-tree"

import { PianoQuoteModel } from "./PianoQuote"

export const PianoQuoteStoreModel = types
  .model("PianoQuoteStore")
  .props({
    quotes: types.array(PianoQuoteModel),
  })
  .views((store) => ({
    get randomQuote() {
      return store.quotes.length ? store.quotes[Math.floor(Math.random() * store.quotes.length)] : undefined
    },
  }))

export interface PianoQuoteStore extends Instance<typeof PianoQuoteStoreModel> {}
export interface PianoQuoteStoreSnapshot extends SnapshotOut<typeof PianoQuoteStoreModel> {}
