import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export enum ActivityEnum {
  "songlearning" = "Song Learning",
  "scales" = "Scales",
  "arpeggios" = "Arpeggios",
  "chords" = "Chords",
  "sightreading" = "Sightreading",
  "eartraining" = "Eartraining",
  "rhythm" = "Rhythm",
  "technique" = "Technique",
  "repertoire" = "Repertoire",
  "composition" = "Composition",
  "improvisation" = "Improvisation",
  "other" = "Other",
}

/**
 * This represents an PracticeSession model.
 */
export const PracticeSessionModel = types
  .model("PracticeSession")
  .props({
    uuid: types.identifier,
    startTime: "",
    endTime: "",
    duration: 0, // seconds
    intencity: 0, // 0 - 10
    satisfaction: 0, // 0 - 5
    notes: "",
    activities: types.optional(
      types.array(
        types.enumeration(
          "activity",
          [
            ActivityEnum.arpeggios,
            ActivityEnum.chords,
            ActivityEnum.composition,
            ActivityEnum.eartraining,
            ActivityEnum.improvisation,
            ActivityEnum.other,
            ActivityEnum.repertoire,
            ActivityEnum.rhythm,
            ActivityEnum.scales,
            ActivityEnum.sightreading,
            ActivityEnum.songlearning,
            ActivityEnum.technique,
          ]
        )
      ),
      []
    ),
  })
  .actions(withSetPropAction)
  .views((practiceSession) => ({
    get formattedDuration() {
      const milliseconds = Number(practiceSession.duration)
      const seconds = Math.floor(milliseconds / 1000)

      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secondsLeft = Math.floor((seconds % 3600) % 60)

      const hoursFormatted = hours > 0 ? `${hours}h` : "00h"
      const minutesFormatted = minutes > 0 ? `${minutes}m` : "00m"
      const secondsFormatted = secondsLeft > 0 ? `${secondsLeft}s` : "00s"
      
      return { hours: hoursFormatted, minutes: minutesFormatted, seconds: secondsFormatted}
    },
  }))

export interface PracticeSession extends Instance<typeof PracticeSessionModel> {}
export interface PracticeSessionSnapshotOut extends SnapshotOut<typeof PracticeSessionModel> {}
export interface PracticeSessionSnapshotIn extends SnapshotIn<typeof PracticeSessionModel> {}
