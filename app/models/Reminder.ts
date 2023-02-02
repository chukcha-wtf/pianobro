import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { clearAllScheduledNotifications, registerForPushNotificationsAsync, removeScheduledNotification, scheduleLocalWeeklyPushNotification } from "@services/pushNotifications"

export type ReminderDate = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
export const REMINDER_DATES: ReminderDate[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const DateToDayMap = {
  "Mon": 1,
  "Tue": 2,
  "Wed": 3,
  "Thu": 4,
  "Fri": 5,
  "Sat": 6,
  "Sun": 7,
}

export const ReminderStoreModel = types
  .model("ReminderStore")
  .props({
    isEnabled: false,
    pushToken: types.optional(types.string, ""),
    time: types.optional(types.string, "9:00"),
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
          store.pushToken = yield registerForPushNotificationsAsync()

          if (!store.pushToken) {
            return
          }
        }
      }
      else {
        // If nextState is false, we need to unregister the token
        store.pushToken = ""
        store.scheduledNotifications.clear()
        yield clearAllScheduledNotifications()
      }

      store.isEnabled = nextState
    })

    const toggleDate = flow(function* (date: ReminderDate) {
      // If the reminder is not enabled, we don't need to do anything
      if (!store.isEnabled) {
        return
      }

      if (store.scheduledNotifications.has(date)) {
        // We need to remove the scheduled notifications for this date
        const scheduledNotificationId = store.scheduledNotifications.get(date)
        yield removeScheduledNotification(scheduledNotificationId)

        store.scheduledNotifications.delete(date)
      } else {
        // We need to schedule a notification for this date
        const scheduledNotificationId = yield scheduleLocalWeeklyPushNotification({
          weekday: DateToDayMap[date],
          hour: parseInt(store.time.split(":")[0]),
          minute: parseInt(store.time.split(":")[1]),
          repeats: true,
        })
        store.scheduledNotifications.set(date, scheduledNotificationId)
      }
    })

    const setTime = flow(function* (time: string) {
      store.time = time
      
      // Update all scheduled notifications
      if (store.scheduledNotifications.size !== 0) {
        store.scheduledNotifications.forEach(function* ([date, scheduledNotificationId]) {
          yield removeScheduledNotification(scheduledNotificationId)

          const newScheduledNotificationId = yield scheduleLocalWeeklyPushNotification({
            weekday: DateToDayMap[date],
            hour: parseInt(time.split(":")[0]),
            minute: parseInt(time.split(":")[1]),
            repeats: true,
          })
          store.scheduledNotifications.set(date, newScheduledNotificationId)
        })
      }
    })

    return {
      toggleEnabled,
      toggleDate,
      setTime,
    }
  })

export interface ReminderStore extends Instance<typeof ReminderStoreModel> {}
export interface ReminderStoreSnapshot extends SnapshotOut<typeof ReminderStoreModel> {}
