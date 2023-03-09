import eachDayOfInterval from "date-fns/eachDayOfInterval";
import { IMSTArray, Instance, ISimpleType, SnapshotOut, types } from "mobx-state-tree"

import { calculateDuration } from "@utils/calculateDuration";
import { formatDuration } from "@utils/formatDate";

import { withSetPropAction } from "./helpers/withSetPropAction";
import { PracticeSession } from "./PracticeSession";
import subDays from "date-fns/subDays";

/**
 * A Statistics model.
 * Final object representation of the data:
 * 
 * {
 *  [year]: {
 *    [month]: {
 *      [day]: {
 *        activities: {
 *          [activityUuid]: {
 *            sessionUuids: [uuid1, uuid2, uuid3],
 *            duration: 123456,
 *          }
 *        },
 *        sessionUuids: [uuid1, uuid2, uuid3],
 *        totalDuration: 123456,
 *      },
 *    },
 *  },
 * }
 *
 */

export type AggregatedActivity = {
  uuid: string,
  name: string,
  key: string,
  sessionUuids: string[],
  duration: number,
}

export enum DynamicsOptions {
  increase = "increase",
  decrease = "decrease",
  same = "same",
}

export type Dynamics = keyof typeof DynamicsOptions

const ActivityRecordModel = types.model("ActivityRecord").props({
  activityUuid: types.string,
  sessionUuids: types.array(types.string),
  name: types.string,
  key: types.string,
  duration: types.number,
})
.actions(withSetPropAction)

const DayRecordModel = types.model("DayRecord").props({
  activities: types.optional(types.map(ActivityRecordModel), {}),
  sessionUuids: types.array(types.string),
  totalDuration: types.number,
})
.actions(withSetPropAction)

const MonthRecordModel = types.model("MonthRecord").props({
  days: types.optional(types.map(DayRecordModel), {}),
})
.actions(withSetPropAction)

const YearRecordModel = types.model("YearRecord").props({
  months: types.optional(types.map(MonthRecordModel), {}),
})
.actions(withSetPropAction)

export const StatisticsStoreModel = types
  .model("StatisticsStore")
  .props({
    progress: types.map(YearRecordModel),
  })
  .actions((store) => {
    return {
      addSession(session: PracticeSession) {
        const { startTime, endTime, duration, uuid, activities } = session

        const start = new Date(startTime)
        const end = new Date(endTime)

        const interval = eachDayOfInterval({ start, end })

        interval.forEach((date, index) => {
          let start = startTime
          let end = endTime
          let sessionDuration = duration

          if (interval.length > 1 && index === 0) {
            start = startTime
            end = date.toISOString()
            sessionDuration = calculateDuration(end, start)
          }

          if (interval.length > 1 && index === interval.length - 1) {
            start = date.toISOString()
            end = endTime
            sessionDuration = calculateDuration(end, start)
          }

          const startYear = date.getFullYear().toString()
          const startMonth = date.getMonth().toString()
          const startDay = date.getDate().toString()

          const yearRecord = store.progress.get(startYear)
          const monthRecord = yearRecord?.months.get(startMonth)
          const existingDayRecord = monthRecord?.days.get(startDay)

          let newDayRecord: Instance<typeof DayRecordModel>;
          
          // Update day record
          if (existingDayRecord) {
            const sessionUuids = existingDayRecord.sessionUuids

            sessionUuids.push(uuid)
            
            existingDayRecord.setProp("sessionUuids", sessionUuids)
            existingDayRecord.setProp("totalDuration", existingDayRecord.totalDuration + sessionDuration)

            // Update activities
            activities.forEach(activity => {
              const activityRecord = existingDayRecord.activities.get(activity.uuid)

              if (activityRecord) {
                const sessionUuids = activityRecord.sessionUuids
                sessionUuids.push(uuid)

                activityRecord.setProp("sessionUuids", sessionUuids)
                activityRecord.setProp("duration", activityRecord.duration + sessionDuration)
              }
              else {
                existingDayRecord.activities.set(activity.uuid, {
                  sessionUuids: [uuid],
                  activityUuid: activity.uuid,
                  duration: sessionDuration,
                  name: activity.name || "",
                  key: activity.key || "",
                })
              }
            })
          }
          else {
            newDayRecord = DayRecordModel.create({
              sessionUuids: [uuid],
              totalDuration: duration,
              activities: activities.reduce((acc, activity) => {
                acc[activity.uuid] = {
                  sessionUuids: [uuid],
                  activityUuid: activity.uuid,
                  name: activity.name || "",
                  key: activity.key || "",
                  duration,
                }
                return acc
              }, {})
            })
          }

          const dayRecord = existingDayRecord || newDayRecord

          // Update month record
          if (monthRecord) {
            monthRecord.days.set(startDay, dayRecord)
            return;
          }

          const newMonthRecord = MonthRecordModel.create({
            days: {
              [startDay]: dayRecord,
            }
          })

          // Update year record
          if (yearRecord) {
            yearRecord.months.set(startMonth, newMonthRecord)
          }
          else {
            const newYearRecord = YearRecordModel.create({
              months: {
                [startMonth]: newMonthRecord,
              }
            })

            store.progress.set(startYear, newYearRecord)
          }
        })
      },
      removeSession(session: PracticeSession) {
        const { startTime, endTime, duration, } = session

        const start = new Date(startTime)
        const end = new Date(endTime)

        const interval = eachDayOfInterval({ start, end })

        interval.forEach((date, index) => {
          let start = startTime
          let end = endTime
          let sessionDuration = duration

          if (interval.length > 1 && index === 0) {
            start = startTime
            end = date.toISOString()
            sessionDuration = calculateDuration(end, start)
          }

          if (interval.length > 1 && index === interval.length - 1) {
            start = date.toISOString()
            end = endTime
            sessionDuration = calculateDuration(end, start)
          }

          const startYear = date.getFullYear().toString()
          const startMonth = date.getMonth().toString()
          const startDay = date.getDate().toString()
          
          const yearRecord = store.progress.get(startYear)
          const monthRecord = yearRecord?.months.get(startMonth)
          const dayRecord = monthRecord?.days.get(startDay)

          // Update day record
          if (dayRecord) {
            dayRecord.sessionUuids = dayRecord.sessionUuids.filter(uuid => uuid !== session.uuid) as IMSTArray<ISimpleType<string>>
            dayRecord.totalDuration = dayRecord.totalDuration - sessionDuration

            // Remove day record if it's empty
            if (dayRecord.sessionUuids.length === 0 || dayRecord.totalDuration === 0) {
              monthRecord.days.delete(startDay)
            }
            else {
              // Update activities
              session.activities.forEach(activity => {
                const activityRecord = dayRecord.activities.get(activity.uuid)
  
                if (activityRecord) {
                  activityRecord.sessionUuids = activityRecord.sessionUuids.filter(uuid => uuid !== session.uuid) as IMSTArray<ISimpleType<string>>
                  activityRecord.duration = activityRecord.duration - sessionDuration
  
                  if (activityRecord.sessionUuids.length === 0 || activityRecord.duration === 0) {
                    dayRecord.activities.delete(activity.uuid)
                  }
                }
              })
            }

          }

          // Update month record
          if (monthRecord.days.size === 0) {
            yearRecord.months.delete(startMonth)
          }

          // Update year record
          if (yearRecord.months.size === 0) {
            store.progress.delete(startYear)
          }
        })
      }
    }
  })
  .views((store) => ({
    getDayRecord(date: Date) {
      const year = date.getFullYear().toString()
      const month = date.getMonth().toString()
      const day = date.getDate().toString()
    
      const yearRecord = store.progress.get(year)
      const monthRecord = yearRecord?.months.get(month)
      const dayRecord = monthRecord?.days.get(day)
    
      return dayRecord
    },
  }))
  .views((store) => ({
    get hasCompletedSessions() {
      // If there are any records in the store, then there are completed sessions
      return store.progress.size > 0
    },

    get totalPracticeTimeToday() {
      const today = new Date()
      const dayRecord = store.getDayRecord(today)

      return formatDuration(dayRecord?.totalDuration || 0)
    },

    get totalPracticeTime() {      
      let total = 0

      // Loop through all records and add up the total duration
      // Nested loops are not nice, but since we're dealing with a tree structure, it's the only way
      // Also the data is not that big, so it's not a big deal
      store.progress.forEach(yearRecord => {
        yearRecord.months.forEach(monthRecord => {
          monthRecord.days.forEach(dayRecord => {
            total += dayRecord.totalDuration
          })
        })
      })

      return formatDuration(total)
    },
    
    get todayCompletedSessionUUids() {
      const today = new Date()
      const dayRecord = store.getDayRecord(today)

      return dayRecord?.sessionUuids || []
    },

    get insights() {
      // Over the past 7 days you played on average 2hrs a day
      let timePlayedLastWeek = 0
      let timePlayedTwoWeeksAgo = 0

      // Over the past week you've spent 3 days playing, that's 2 days more (less) than a week before
      let daysPlayedLastWeek = 0
      let daysPlayedTwoWeeksAgo = 0

      // Over the past 7 days you've spent the most time practicing Hanon, Song Learning and Arpeggios
      const activitiesPlayedLastWeek: { [key: string]: number } = {}

      const today = new Date()
      const weekAgo = subDays(today, 7)
      const twoWeeksAgo = subDays(today, 14)

      const weekAgoInterval = eachDayOfInterval({ start: weekAgo, end: today })
      const twoWeeksAgoInterval = eachDayOfInterval({ start: twoWeeksAgo, end: today })

      weekAgoInterval.forEach(date => {
        const dayRecord = store.getDayRecord(date)

        if (dayRecord) {
          daysPlayedLastWeek += 1
          timePlayedLastWeek += dayRecord.totalDuration || 0
          
          dayRecord.activities.forEach(activityRecord => {
            if (activitiesPlayedLastWeek[activityRecord.key]) {
              activitiesPlayedLastWeek[activityRecord.key] += 1
            }
            else {
              activitiesPlayedLastWeek[activityRecord.key] = 1
            }
          })
        }
      })

      twoWeeksAgoInterval.forEach(date => {
        const dayRecord = store.getDayRecord(date)

        if (dayRecord) {
          daysPlayedTwoWeeksAgo += 1
          timePlayedTwoWeeksAgo += dayRecord.totalDuration || 0
        }
      })

      const timeDynamics = timePlayedLastWeek > timePlayedTwoWeeksAgo ? DynamicsOptions.increase : DynamicsOptions.decrease
      const daysDynamics = daysPlayedLastWeek > daysPlayedTwoWeeksAgo ? DynamicsOptions.increase : DynamicsOptions.decrease

      const popularActivities = Object.keys(activitiesPlayedLastWeek).sort((a, b) => activitiesPlayedLastWeek[b] - activitiesPlayedLastWeek[a]).slice(0, 2)

      return {
        time: [formatDuration(timePlayedLastWeek), formatDuration(timePlayedTwoWeeksAgo), timeDynamics],
        days: [daysPlayedLastWeek, daysPlayedTwoWeeksAgo, daysDynamics],
        activities: popularActivities
      } as const
    },
  }))
  .views((store) => ({
    getRecordsBetween(start: Date, end: Date, mode: "week" | "month" | "year" = "week") { 
      const sessionUuids: string[] = []
      const activities: Map<string, AggregatedActivity> = new Map()
      const daysPracticed: Map<string, number> = new Map()
      let totalPracticeTime = 0

      const buildDayData = (dayRecord, year, month, day) => {
        // Add day to days practiced
        daysPracticed.set(`${year}.${month}.${day}`, dayRecord.totalDuration)

        // Populate sessionUuids
        sessionUuids.push(...dayRecord.sessionUuids)
        
        totalPracticeTime += dayRecord.totalDuration

        const dayRecordActivities = Object.fromEntries(activities.entries())

        dayRecord.activities.forEach(activityRecord => {
          const activity = dayRecordActivities[activityRecord.activityUuid]

          if (activity) {
            activity.duration += activityRecord.duration
            activity.sessionUuids.push(...activityRecord.sessionUuids)
            activities.set(activityRecord.activityUuid, activity)
          }
          else {
            activities.set(activityRecord.activityUuid, {
              uuid: activityRecord.activityUuid,
              duration: activityRecord.duration,
              name: activityRecord.name,
              key: activityRecord.key,
              sessionUuids: [...activityRecord.sessionUuids],
            })
          }
        })
      }

      if (mode === "week") {
        const interval = eachDayOfInterval({ start, end })
  
        interval.forEach(date => {
          const dayRecord = store.getDayRecord(date)
  
          if (dayRecord) {
            const year = date.getFullYear().toString()
            const month = date.getMonth().toString()
            const day = date.getDate().toString()
            
            buildDayData(dayRecord, year, month, day)
          }
        })
      }

      if (mode === "month") {
        const year = start.getFullYear().toString()
        const month = start.getMonth().toString()

        store.progress.get(year)?.months.get(month)?.days.forEach((dayRecord, day) => {          
          buildDayData(dayRecord, year, month, day)
        })
      }

      if (mode === "year") {
        const year = start.getFullYear().toString()

        store.progress.get(year)?.months.forEach((monthRecord, month) => {
          monthRecord.days.forEach((dayRecord, day) => {
            buildDayData(dayRecord, year, month, day)
          })
        })
      }

      return {
        sessionUuids,
        activities: Array.from(activities.values()),
        daysPracticed,
        totalPracticeTime,
      }
    },

    getActivityRecordsBetween(start: Date, end: Date, activityUuid: string) {
      const interval = eachDayOfInterval({ start, end })

      const sessionUuids: string[] = []
      const daysPracticed: Map<string, number> = new Map()
      let totalPracticeTime = 0

      interval.forEach(date => {
        const dayRecord = store.getDayRecord(date)

        if (dayRecord && dayRecord.activities.has(activityUuid)) {
          const activityRecord = dayRecord.activities.get(activityUuid)

          const year = date.getFullYear().toString()
          const month = date.getMonth().toString()
          const day = date.getDate().toString()
          
          // Add day to days practiced
          daysPracticed.set(`${year}.${month}.${day}`, activityRecord.duration)

          // Populate sessionUuids
          sessionUuids.push(...activityRecord.sessionUuids)
          
          totalPracticeTime += activityRecord.duration
        }
      })

      return {
        sessionUuids: [...new Set(sessionUuids)],
        daysPracticed,
        totalPracticeTime,
      }
    },

  }))

export interface StatisticsStore extends Instance<typeof StatisticsStoreModel> {}
export interface StatisticsStoreSnapshot extends SnapshotOut<typeof StatisticsStoreModel> {}
