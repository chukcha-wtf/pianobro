import { destroy, Instance, SnapshotOut, types } from "mobx-state-tree"
import { v4 as uuidv4 } from 'uuid';

import { PracticeSession, PracticeSessionModel } from "./PracticeSession"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { calculateDuration } from "@utils/calculateDuration"
import { Activity } from "./Activity";

export const PracticeSessionStoreModel = types
  .model("PracticeSessionStore")
  .props({
    practiceSessions: types.map(PracticeSessionModel),
    isPracticing: false,
  })
  .actions(withSetPropAction)
  .views((store) => {
    return {
      get activeSession() {
        return Array.from(store.practiceSessions.values()).find(session => session.isActive)
      },

      get practiceSessionsList() {
        return Array.from(store.practiceSessions.values())
      }
    }
  })
  .actions((store) => {
    return {
      updateDuration() {
        if (!store.isPracticing) {
          return
        }

        const activeSession = store.activeSession

        activeSession.duration = calculateDuration(new Date().toISOString(), activeSession.startTime)
        activeSession.endTime = new Date().toISOString()
      },

      start() {
        if (store.isPracticing) {
          return
        }

        store.isPracticing = true

        // Do not create a new session if there is an active one
        if (store.activeSession) {
          return
        }
        
        const practiceSession = PracticeSessionModel.create({
          uuid: uuidv4(),
          startTime: new Date().toISOString(),
          isActive: true,
          duration: 0,
        })

        store.practiceSessions.set(practiceSession.uuid, practiceSession)
      },

      completeSession(practiceSession: PracticeSession, activities: Array<Activity>) {
        if (!store.isPracticing) {
          return null
        }

        const activeSession = store.activeSession

        activeSession.isActive = false
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

        return activeSession
      },

      addSession(practiceSession: PracticeSession, activities: Array<Activity>) {
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

        store.practiceSessions.set(newPracticeSession.uuid, newPracticeSession)

        return newPracticeSession
      },

      deleteSession(sessionId: string) {
        const session = store.practiceSessionsList.find(session => session.uuid === sessionId)

        destroy(session)
      },
    }
  })
  .views((store) => ({
    getSessionById(sessionId: string) {
      return store.practiceSessionsList.find(session => session.uuid === sessionId)
    },

    getSessionsFromUuids(sessionsUuids: Array<string>) {
      const sessions = []

      sessionsUuids.forEach(uuid => {
        sessions.push(store.practiceSessions.get(uuid))
      })

      return sessions
    },
  }))

export interface PracticeSessionStore extends Instance<typeof PracticeSessionStoreModel> {}
export interface PracticeSessionStoreSnapshot extends SnapshotOut<typeof PracticeSessionStoreModel> {}
