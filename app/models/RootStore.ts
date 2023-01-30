import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ActivityStoreModel } from "./Activity"
import { PianoQuoteStoreModel } from "./PianoQuote"
import { PracticeSessionStoreModel } from "./PracticeSessionStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  practiceSessionStore: types.optional(PracticeSessionStoreModel, {}),
  quotesStore: types.optional(PianoQuoteStoreModel, {}),
  activitiesStore: types.optional(ActivityStoreModel, {})
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
