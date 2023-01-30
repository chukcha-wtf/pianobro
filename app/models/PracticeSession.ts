import { formatDuration } from "@utils/formatDate"
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { Activity, ActivityModel } from "./Activity"
import { withSetPropAction } from "./helpers/withSetPropAction"

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
    isActive: false,
    activities: types.optional(types.array(types.reference(ActivityModel)), []),
  })
  .actions(withSetPropAction)
  .actions((practiceSession) => ({
    addActivity(activity: Activity) {
      practiceSession.activities.push(activity.uuid)
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
