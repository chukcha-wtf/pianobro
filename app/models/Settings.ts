import { formatDate } from "@utils/formatDate"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const SettingsStoreModel = types
  .model("SettingsStore")
  .props({
    installDate: types.optional(types.string, ""),
  })
  .actions((store) => ({
    setInstallDate() {
      if (store.installDate) {
        return
      }

      store.installDate = new Date().toISOString()
    }
  }))
  .views((store) => ({
    get startDate() {
      return store.installDate ? formatDate(store.installDate, "dd MMM, yyyy") : ""
    },
  }))


export interface SettingsStore extends Instance<typeof SettingsStoreModel> {}
export interface SettingsStoreSnapshot extends SnapshotOut<typeof SettingsStoreModel> {}
