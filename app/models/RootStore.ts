import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ActivityStoreModel } from "./Activity"
import { PianoQuoteStoreModel } from "./PianoQuote"
import { PracticeSessionStoreModel } from "./PracticeSessionStore"
import { ReminderStoreModel } from "./Reminder"
import { SettingsStoreModel } from "./Settings"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  practiceSessionStore: types.optional(PracticeSessionStoreModel, {}),
  quotesStore: types.optional(PianoQuoteStoreModel, {}),
  activitiesStore: types.optional(ActivityStoreModel, {}),
  remindersStore: types.optional(ReminderStoreModel, {}),
  settingsStore: types.optional(SettingsStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
