import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ActivityEnum, PracticeSessionModel } from "./PracticeSession"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { calculateDuration } from "@utils/calculateDuration"

export const PracticeSessionStoreModel = types
  .model("PracticeSessionStore")
  .props({
    practiceSessions: types.array(PracticeSessionModel),
    isPracticing: false,
  })
  .actions(withSetPropAction)
  .views((store) => ({
    get activeSession() {
      return store.practiceSessions.find(session => !session.endTime || !session.duration)
    },
  }))
  .actions((store) => {
    return {
      updateDuration() {
        if (!store.isPracticing) {
          return
        }

        const activeSession = store.practiceSessions.find(session => !session.endTime || !session.duration)

        activeSession.duration = calculateDuration(new Date().toISOString(), activeSession.startTime)
      },
      start() {
        if (store.isPracticing) {
          return
        }

        store.isPracticing = true

        if (store.activeSession) {
          return
        }
        
        const practiceSession = PracticeSessionModel.create({
          uuid: Math.random().toString(36).substring(7),
          startTime: new Date().toISOString(),
          duration: 0,
        })

        store.practiceSessions.push(practiceSession)
      },
      stop(practiceSession: Instance<typeof PracticeSessionModel>, activities: Array<keyof typeof ActivityEnum>) {
        if (!store.isPracticing) {
          return
        }

        console.log("STOP", practiceSession)

        const activeSession = store.activeSession

        activeSession.startTime = practiceSession.startTime
        activeSession.endTime = practiceSession.endTime
        activeSession.duration = practiceSession.duration
        activeSession.intencity = practiceSession.intencity
        activeSession.notes = practiceSession.notes
        activeSession.satisfaction = practiceSession.satisfaction

        activities.forEach(activity => {
          activeSession.addActivity(activity)
        })
        
        store.isPracticing = false
      },
      pause() {
        if (!store.isPracticing) {
          return
        }

        store.isPracticing = false
      },
      resume() {
        if (store.isPracticing) {
          return
        }

        store.isPracticing = true
      }
    }
  })
  .views((store) => ({
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
