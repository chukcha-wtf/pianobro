import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { v4 as uuidv4 } from 'uuid';

import { PracticeSession, PracticeSessionModel } from "./PracticeSession"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { calculateDuration } from "@utils/calculateDuration"
import { DurationObject, formatDuration } from "@utils/formatDate";
import { Activity } from "./Activity";

export const PracticeSessionStoreModel = types
  .model("PracticeSessionStore")
  .props({
    practiceSessions: types.array(PracticeSessionModel),
    isPracticing: false,
  })
  .actions(withSetPropAction)
  .views((store) => {
    return {
      get activeSession() {
        return store.practiceSessions.find(session => session.isActive)
      },
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

        store.practiceSessions.push(practiceSession)
      },
      stop(practiceSession: PracticeSession, activities: Array<Activity>) {
        if (!store.isPracticing) {
          return
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
      return store.practiceSessions.filter(
        session => session.endTime && session.duration
      ).sort(sortByDateAsc)
    },

    get sessionsCompletedToday() {
      return store.practiceSessions.filter(session => {
        return session.endTime && session.duration && !session.isActive &&
          new Date(session.endTime).toDateString() === new Date().toDateString()
      }).sort(sortByDateAsc)
    },

    getSessionsCompletedBetweenDates(startDate: Date, endDate: Date) {
      return store.practiceSessions.filter(session => {
        return session.endTime && session.duration &&
          new Date(session.endTime).getTime() >= startDate.getTime() &&
          new Date(session.endTime).getTime() <= endDate.getTime()
      }).sort(sortByDateAsc)
    },

    getActivitiesFromSessions(sessions: Array<PracticeSession>) {
      const allActivities = sessions.reduce((acc, session) => {
        return acc.concat(session.activities)
      }, [])

      const uniqueActivities = [...new Set(allActivities)]

      const sessionsByActivity: {
        key: string,
        humanTitle: string,
        sessions: Array<PracticeSession>,
        duration: DurationObject,
      }[] = []
      
      uniqueActivities.forEach((activity: Activity) => {
        const sessionsWithActivity = sessions.filter(session => session.activities.includes(activity))
        const totalDuration = sessionsWithActivity.reduce((acc, session) => acc + session.duration, 0)

        sessionsByActivity.push({
          key: activity.uuid,
          humanTitle: activity.name,
          sessions: sessionsWithActivity,
          duration: formatDuration(totalDuration),
        })
      })

      return sessionsByActivity
    },
  }))
  .views((store) => ({
    get hasCompletedSessions() {
      return store.completedSessions.length > 0
    },

    get totalPracticeTimeToday() {
      const totalDuration = store.sessionsCompletedToday.reduce((acc, session) => acc + session.duration, 0)

      return formatDuration(totalDuration)
    },

    get totalPracticeTime() {
      const totalDuration = store.completedSessions.reduce((acc, session) => acc + session.duration, 0)

      return formatDuration(totalDuration)
    },

    getTotalPracticeTimeBetweenDates(startDate: Date, endDate: Date) {
      const sessions = store.getSessionsCompletedBetweenDates(startDate, endDate)
      const totalDuration = sessions.reduce((acc, session) => acc + session.duration, 0)

      return formatDuration(totalDuration)
    },

    getDaysWithCompletedSessionsBetweenDates(startDate: Date, endDate: Date) {
      const sessions = store.getSessionsCompletedBetweenDates(startDate, endDate)

      const days = sessions.reduce((acc, session) => {
        const day = new Date(session.endTime).toDateString()

        if (!acc.includes(day)) {
          acc.push(day)
        }

        return acc
      }, [])

      return days
    },

  }))

// Util function to sort by date
const sortByDateAsc = (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime()

export interface PracticeSessionStore extends Instance<typeof PracticeSessionStoreModel> {}
export interface PracticeSessionStoreSnapshot extends SnapshotOut<typeof PracticeSessionStoreModel> {}
