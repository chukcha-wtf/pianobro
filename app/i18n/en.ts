const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    delete: "Delete",
    save: "Save",
    back: "Back",
    hr: "hr",
    min: "min",
    h: "h",
    m: "m",
  },
  dates: {
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
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
  practiceItem: {
    others: "others",
  },
  homeScreen: {
    title: "Hey 👋",
    subtitle: "Let's Play!",
    practicedToday: "You practiced today",
    keepUpGoodWork: "Keep up the good work!",
    noSessionsLogged: "You haven't logged any practice sessions\ntoday yet.",
    addSessionLink: "Add practice session",
    mainButtonTextActive: "Stop",
    mainButtonTextInactive: "Start Practicing",
    activeSession: {
      title: "Practice in Progress",
      subtitle: "Shhh, let the music flow...",
    }
  },
  insights: {
    days: {
      one: "day",
      other: "days",
    },
    daysPracticedText: "You've practiced for over the past week.",
    timePracticedText: "You've played for over the past 7 days.",
    timePracticedSubText: "That's %{context} from the week before.",
    prefixAn: "an",
    prefixThe: "the",
    dynamicsIncrease: "increase",
    dynamicsDecrease: "decrease",
    activitiesText: "Some of the most popular activities last week.",
  },
  profileScreen: {
    title: "Profile",
    reportBugs: "Report bugs",
    totalProgress: "Total Progress",
    since: "Since",
    appVersion: "App Version",
    practiceReminders: "Practice Reminders",
    practiceRemindersDescription: "Set up reminders for your practice.\nStaying consistent can help you improve results!",
    practiceGoal: "Practice Goal",
    practiceGoalDescription: "Set a goal for your practice time.\nYou can change this at any time.",
    practiceGoalPickerTitle: "Set Practice Goal",
    alertTitle: "Notifications Not Enabled",
    alertMessage: "You can enable notifications in the app settings.",
    alertButton: "Open Settings",

    dates: {
      Sun: "Sun",
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thu",
      Fri: "Fri",
      Sat: "Sat",
    }
  },
  progressScreen: {
    title: "Progress",
    noProgress: "Your progress will appear\nonce you log a practice session.",
    sessions: {
      one: "Session",
      other: "Sessions",
    },
    time: "Time",
    days: "Days",
    activities: "Activities",
    practiceSessions: "Practice Sessions",
    noPracticeSessions: "Looks like you haven't logged any practice sessions over selected period.",
  },
  sessionDetailsScreen: {
    title: "Session Details",
    deleteSession: "Delete Session",
    deleteSessionConfirmation: "Are you sure you want to delete this session?",
    practiceTime: "Practice Time",
    rating: "Rating",
    difficulty: "Difficulty",
    fun: "Fun",
    noFun: "No fun",
    categories: "Categories",
    comments: "Comments",
  },
  activityDetailsScreen: {
    practiceTime: "Practice Time",
  },
  practiceForm: {
    title: "You played for",
    today: "today",
    whatPracticed: "What did you practice?",
    wasItHard: "Was it hard?",
    wasItFun: "Was it fun?",
    notes: "Notes",
    placeholder: "Add details...",
  },
  activity: {
    songlearning: "Song Learning",
    scales: "Scales",
    arpeggios: "Arpeggios",
    chords: "Chords",
    sightreading: "Sight Reading",
    eartraining: "Ear Training",
    rhythm: "Rhythm",
    hanon: "Hanon",
    repertoire: "Repertoire",
    improvisation: "Improvisation",
    fingerindependence: "Finger Independence",
    composition: "Composition",
    technique: "Technique",
    other: "Other",
  },
  chartControl: {
    week: "Week",
    month: "Month",
    year: "Year",
  },
  progressChart: {
    noData: "No data",
  }
}

export default en
export type Translations = typeof en
