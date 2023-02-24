import { Instance, SnapshotOut, types } from "mobx-state-tree"

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

export const StatisticsStoreModel = types
  .model("StatisticsStore")
  .props({
    progress: types.map(types.frozen<string>()),
  })

export interface StatisticsStore extends Instance<typeof StatisticsStoreModel> {}
export interface StatisticsStoreSnapshot extends SnapshotOut<typeof StatisticsStoreModel> {}
