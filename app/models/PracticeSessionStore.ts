import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { v4 as uuidv4 } from 'uuid';

import { ActivityEnum, PracticeSessionModel } from "./PracticeSession"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { calculateDuration } from "@utils/calculateDuration"
import { formatDuration } from "@utils/formatDate";

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
          uuid: uuidv4(),
          startTime: new Date().toISOString(),
          duration: 0,
        })

        store.practiceSessions.push(practiceSession)
      },
      stop(practiceSession: Instance<typeof PracticeSessionModel>, activities: Array<keyof typeof ActivityEnum>) {
        if (!store.isPracticing) {
          return
        }

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
      addSession(practiceSession: Instance<typeof PracticeSessionModel>, activities: Array<keyof typeof ActivityEnum>) {
        const newPracticeSession = PracticeSessionModel.create({
          uuid: uuidv4(),
          startTime: practiceSession.startTime,
          endTime: practiceSession.endTime,
          duration: practiceSession.duration,
          intencity: practiceSession.intencity,
          notes: practiceSession.notes,
          satisfaction: practiceSession.satisfaction,
        })

        activities.forEach(activity => {
          newPracticeSession.addActivity(activity)
        })

        store.practiceSessions.push(newPracticeSession)
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
    },
  }))
  .views((store) => ({
    get totalPracticeTimeToday() {
      const totalDuration = store.sessionsCompletedToday.reduce((acc, session) => acc + session.duration, 0)

      return formatDuration(totalDuration)
    }
  }))

export interface PracticeSessionStore extends Instance<typeof PracticeSessionStoreModel> {}
export interface PracticeSessionStoreSnapshot extends SnapshotOut<typeof PracticeSessionStoreModel> {}
