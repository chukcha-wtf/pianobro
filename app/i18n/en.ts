const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "We're working on the problem.",
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
    mainButtonTextActive: "Stop Practicing",
    mainButtonTextInactive: "Start Practicing",
  },
  statisticsScreen: {
    title: "Statistics",
  },
}

export default en
export type Translations = typeof en
