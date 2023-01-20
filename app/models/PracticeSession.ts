import { formatDuration } from "@utils/formatDate"
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export enum ActivityEnum {
  "songlearning" = "Song Learning",
  "scales" = "Scales",
  "arpeggios" = "Arpeggios",
  "chords" = "Chords",
  "sightreading" = "Sight Reading",
  "eartraining" = "Ear Training",
  "rhythm" = "Rhythm",
  "technique" = "Technique",
  "repertoire" = "Repertoire",
  "composition" = "Composition",
  "improvisation" = "Improvisation",
  "fingerindependence" = "Finger Independence",
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
            "arpeggios",
            "chords",
            "composition",
            "eartraining",
            "improvisation",
            "other",
            "repertoire",
            "rhythm",
            "scales",
            "sightreading",
            "songlearning",
            "technique",
          ]
        )
      ),
      []
    ),
  })
  .actions(withSetPropAction)
  .actions((practiceSession) => ({
    addActivity(activity: keyof typeof ActivityEnum) {
      practiceSession.activities.push(activity)
    }
  }))
  .views((practiceSession) => ({
    get formattedDuration() {
      return formatDuration(practiceSession.duration)
    },
  }))

export interface PracticeSession extends Instance<typeof PracticeSessionModel> {}
export interface PracticeSessionSnapshotOut extends SnapshotOut<typeof PracticeSessionModel> {}
export interface PracticeSessionSnapshotIn extends SnapshotIn<typeof PracticeSessionModel> {}
