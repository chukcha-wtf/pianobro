/**
 * Helper function to populate the state with some dummy data
 * It will create a random number of practice sessions for the past two years
 * 
 * @function populateDevData
 * @param store The store to populate
 * @param numberOfSessions The number of sessions to create
 * 
 */

import { PracticeSession } from "@models/PracticeSession";
import { RootStore } from "@models/RootStore";

export function populateDevData(store: RootStore, numberOfSessions: number) {
  const startDate = new Date().setFullYear(new Date().getFullYear() - 2)
  const endDate = new Date()

  for (let i = 0; i < numberOfSessions; i++) {
    const randomDate = new Date(startDate + Math.random() * (endDate.getTime() - startDate))
    // Random duration between 1 and 8 hours
    const randomDuration = Math.floor(Math.random() * 8 * 60) * 60 * 1000
    const randomActivity = store.activitiesStore.activities[Math.floor(Math.random() * store.activitiesStore.activities.length)]

    const intencity = Math.floor(Math.random() * 10)
    const satisfaction = Math.floor(Math.random() * 5)
    const comments = "Just a random comment about my practice session"

    store.practiceSessionStore.addSession({
      uuid: "1",
      startTime: randomDate.toISOString(),
      endTime: new Date(randomDate.getTime() + randomDuration).toISOString(),
      duration: randomDuration,
      notes: comments,
      intencity,
      satisfaction,
    } as PracticeSession, [randomActivity])
  }
}