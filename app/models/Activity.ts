import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

export const ACTIVITIES: Array<Activity> = [
  {
    uuid: "1",
    name: "Song Learning",
    key: "songlearning",
  },
  {
    uuid: "2",
    name: "Scales",
    key: "scales",
  },
  {
    uuid: "3",
    name: "Arpeggios",
    key: "arpeggios",
  },
  {
    uuid: "4",
    name: "Chords",
    key: "chords",
  },
  {
    uuid: "5",
    name: "Sight Reading",
    key: "sightreading",
  },
  {
    uuid: "6",
    name: "Ear Training",
    key: "eartraining",
  },
  {
    uuid: "7",
    name: "Rhythm",
    key: "rhythm",
  },
  {
    uuid: "8",
    name: "Hanon",
    key: "hanon",
  },
  {
    uuid: "9",
    name: "Technique",
    key: "technique",
  },
  {
    uuid: "10",
    name: "Repertoire",
    key: "repertoire",
  },
  {
    uuid: "11",
    name: "Composition",
    key: "composition",
  },
  {
    uuid: "12",
    name: "Improvisation",
    key: "improvisation",
  },
  {
    uuid: "13",
    name: "Finger Independence",
    key: "fingerindependence",
  },
  {
    uuid: "14",
    name: "Other",
    key: "other",
  }
]

export const ActivityModel = types
  .model("Activity")
  .props({
    uuid: types.identifier,
    name: "",
    key: "",
  })

export interface Activity extends Instance<typeof ActivityModel> {}
export interface ActivitySnapshotOut extends SnapshotOut<typeof ActivityModel> {}
export interface ActivitySnapshotIn extends SnapshotIn<typeof ActivityModel> {}

export const ActivityStoreModel = types
  .model("ActivityStore")
  .props({
    activities: types.array(ActivityModel),
  })
  .views((store) => {
    return {
      getActivityById(uuid: string) {
        return store.activities.find((activity) => activity.uuid === uuid)
      },
    }
  })

// Populate the store with the activities
// ActivityStoreModel.create({ activities: ACTIVITIES })

export interface ActivityStore extends Instance<typeof ActivityStoreModel> {}
export interface ActivityStoreSnapshot extends SnapshotOut<typeof ActivityStoreModel> {}
