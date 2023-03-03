import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { clearAllScheduledNotifications, registerForPushNotificationsAsync, removeScheduledNotification, scheduleLocalWeeklyPushNotification } from "@services/pushNotifications"
import { getCalendars } from "expo-localization"

export type ReminderDate = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"

const DateToDayMap = {
  "Sun": 1,
  "Mon": 2,
  "Tue": 3,
  "Wed": 4,
  "Thu": 5,
  "Fri": 6,
  "Sat": 7,
}

export const getReminderDates = (): ReminderDate[] => {
  const dates: ReminderDate[] = []
  const firstWeekday = getCalendars()[0].firstWeekday || 1

  const days = Object.keys(DateToDayMap) as ReminderDate[]
  const mainArray = days.slice(firstWeekday - 1, days.length)
  const secondaryArray = days.slice(0, firstWeekday - 1)

  dates.push(...mainArray, ...secondaryArray)

  return dates;
} 

export const ReminderStoreModel = types
  .model("ReminderStore")
  .props({
    isEnabled: false,
    pushToken: types.optional(types.string, ""),
    goal: types.optional(types.number, 0), // In minutes
    scheduledDates: types.map(types.frozen<string>()),
    scheduledNotifications: types.map(types.frozen<string>())
  })
  .actions((store) => {
    const toggleEnabled = flow(function* () {
      const nextState = !store.isEnabled
      const token = store.pushToken

      // If nextState is true, we need to register the token
      if (nextState) {
        // If there is no token, we need to register for push notifications
        if (!token) {
          const newToken = yield registerForPushNotificationsAsync()
          store.pushToken = newToken

          if (!newToken) {
            return
          }
        }
      }
      else {
        // If nextState is false, we need to unregister the token
        store.pushToken = ""
        store.scheduledNotifications.clear()
        store.scheduledDates.clear()
        yield clearAllScheduledNotifications()
      }

      store.isEnabled = nextState
    })

    const setDateReminder = flow(function* (date: ReminderDate, time: string) {
      // If the reminder is not enabled, we don't need to do anything
      if (!store.isEnabled) {
        return
      }

      // We need to schedule a notification for this date
      const scheduledNotificationId = yield scheduleLocalWeeklyPushNotification({
        weekday: DateToDayMap[date],
        hour: parseInt(time.split(":")[0]),
        minute: parseInt(time.split(":")[1]),
        repeats: true,
      })

      store.scheduledDates.set(date, time)
      store.scheduledNotifications.set(date, scheduledNotificationId)
    })

    const removeDateReminder = flow(function* (date: ReminderDate) {
      // If the reminder is not enabled, we don't need to do anything
      if (!store.isEnabled) {
        return
      }
      
      // We need to remove the scheduled notifications for this date
      const scheduledNotificationId = store.scheduledNotifications.get(date)
      yield removeScheduledNotification(scheduledNotificationId)

      store.scheduledNotifications.delete(date)
      store.scheduledDates.delete(date)
    })

    const setGoalTime = function(time: number) {
      store.goal = time      
    }

    return {
      toggleEnabled,
      setDateReminder,
      removeDateReminder,
      setGoalTime,
    }
  })
  .views((store) => ({
    isDateScheduled(date: string) {
      return store.scheduledDates.has(date)
    },

    getScheduleTime(date: string) {
      return store.scheduledDates.get(date)
    },

    getGoalTime() {
      return store.goal
    },
  }))


export interface ReminderStore extends Instance<typeof ReminderStoreModel> {}
export interface ReminderStoreSnapshot extends SnapshotOut<typeof ReminderStoreModel> {}
