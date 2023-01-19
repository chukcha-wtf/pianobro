import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { PracticeSessionModel } from "./PracticeSession"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const PracticeSessionStoreModel = types
  .model("PracticeSessionStore")
  .props({
    practiceSessions: types.array(PracticeSessionModel),
    isPracticing: false,
  })
  .actions(withSetPropAction)
  .actions((store) => {
    return {
      updateDuration() {
        if (!store.isPracticing) {
          return
        }

        const activeSession = store.practiceSessions.find(session => !session.endTime || !session.duration)

        activeSession.duration = Math.floor(
          (new Date().getTime() -
            new Date(activeSession.startTime).getTime()),
        )
      },
      start() {
        if (store.isPracticing) {
          return
        }

        const practiceSession = PracticeSessionModel.create({
          uuid: Math.random().toString(36).substring(7),
          startTime: new Date().toISOString(),
          duration: 0,
        })

        store.practiceSessions.push(practiceSession)
        store.isPracticing = true
      },
      stop() {
        if (!store.isPracticing) {
          return
        }

        const activeSession = store.practiceSessions.find(session => !session.endTime || !session.duration)

        activeSession.endTime = new Date().toISOString()
        activeSession.duration = Math.floor(
          (new Date(activeSession.endTime).getTime() -
            new Date(activeSession.startTime).getTime()),
        )
        store.isPracticing = false
      },
    }
  })
  .views((store) => ({
    get activeSession() {
      return store.isPracticing ? store.practiceSessions.find(session => !session.endTime || !session.duration) : null
    },

    get completedSessions() {
      return store.practiceSessions.filter(session => session.endTime && session.duration).sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
    },

    get sessionsCompletedToday() {
      return store.practiceSessions.filter(session => {
        return session.endTime && session.duration &&
          new Date(session.endTime).toDateString() === new Date().toDateString()
      }).sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
    }
  }))

export interface PracticeSessionStore extends Instance<typeof PracticeSessionStoreModel> {}
export interface PracticeSessionStoreSnapshot extends SnapshotOut<typeof PracticeSessionStoreModel> {}
