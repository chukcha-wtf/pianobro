const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
  },
  errorScreen: {
    header: "Ooops...",
    title: "Something went wrong!",
    friendlySubtitle:
      "We're working on the problem.\nIn the meantime - feel free to restart the app.",
    reset: "Restart the app",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  errors: {
  },
  mainNavigator: {
    homeTab: "Home",
    statisticsTab: "Statistics",
    profileTab: "Profile",
  },
  profileScreen: {
    title: "Profile",
    reportBugs: "Report bugs",
  },
  homeScreen: {
    title: "Let's Play!",
    mainButtonTextActive: "Stop",
    mainButtonTextInactive: "Start Practicing",
  },
  progressScreen: {
    title: "Progress",
  },
  sessionDetailsScreen: {
    title: "Session Details",
  },
  activityDetailsScreen: {
    title: "Activity Details",
  },
}

export default en
export type Translations = typeof en
