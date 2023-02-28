import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Activity, ActivityStoreModel } from "./Activity"
import { PianoQuoteStoreModel } from "./PianoQuote"
import { PracticeSession } from "./PracticeSession"
import { PracticeSessionStoreModel } from "./PracticeSessionStore"
import { ReminderStoreModel } from "./Reminder"
import { SettingsStoreModel } from "./Settings"
import { StatisticsStoreModel } from "./Statistics"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  practiceSessionStore: types.optional(PracticeSessionStoreModel, {}),
  quotesStore: types.optional(PianoQuoteStoreModel, {}),
  activitiesStore: types.optional(ActivityStoreModel, {}),
  remindersStore: types.optional(ReminderStoreModel, {}),
  settingsStore: types.optional(SettingsStoreModel, {}),
  statisticsStore: types.optional(StatisticsStoreModel, {}),
})
.actions((store) => {
  return {
    completeSession(practiceSession: PracticeSession, activities: Array<Activity>) {
      const { practiceSessionStore, statisticsStore } = store

      // Update the statistics
      const session = practiceSessionStore.completeSession(practiceSession, activities)
      statisticsStore.addSession(session)
    },

    trackSession(practiceSession: PracticeSession, activities: Array<Activity>) {
      const { practiceSessionStore, statisticsStore } = store

      // Update the statistics
      const session = practiceSessionStore.addSession(practiceSession, activities)
      statisticsStore.addSession(session)
    },

    removeSession(sessionId: string) {
      const { practiceSessionStore, statisticsStore } = store

      const session = practiceSessionStore.practiceSessionsList.find(session => session.uuid === sessionId)

      statisticsStore.removeSession(session)
      practiceSessionStore.deleteSession(sessionId)
    }
  }
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
