import { Translations } from "./en"

const uk: Translations = {
  common: {
    ok: "OK!",
    cancel: "Скасувати",
    delete: "Видалити",
    save: "Зберегти",
    back: "Назад",
    hr: "год",
    min: "хв",
    h: "г",
    m: "хв",
  },
  dates: {
    today: "Сьогодні",
    thisWeek: "Цього Тижня",
    thisMonth: "Цього Місяця",
    thisYear: "Цього року",
  },
  errorScreen: {
    header: "Отакої...",
    title: "Щось пішло не так!",
    friendlySubtitle:
      "Ми вже працюємо над проблемою.\nА поки - спробуйте перезапустити додаток.",
    reset: "Перезапустити додаток",
  },
  emptyStateComponent: {
    generic: {
      heading: "Тут нічого немає...",
      content: "Ми не знайшли жодних даних.",
      button: "Спробуємо ще раз",
    },
  },
  errors: {
  },
  mainNavigator: {
    homeTab: "Головна",
    statisticsTab: "Прогрес",
    profileTab: "Профіль",
  },
  practiceItem: {
    others: "ще",
  },
  homeScreen: {
    title: "Привіт 👋",
    subtitle: "Зіграємо?",
    practicedToday: "Зіграно сьогодні",
    keepUpGoodWork: "Так тримати!",
    noSessionsLogged: "Сьогодні ще не було жодних вправ",
    addSessionLink: "Додати тренування",
    mainButtonTextActive: "Стоп",
    mainButtonTextInactive: "Розпочати",
    activeSession: {
      title: "Заняття розпочато",
      subtitle: "Тихесенько, не відволікайся...",
    }
  },
  profileScreen: {
    title: "Профіль",
    reportBugs: "Повідомити про моилку",
    totalProgress: "Загальний Прогрес",
    since: "Від",
    appVersion: "Версія",
    practiceReminders: "Нагадування",
    practiceRemindersDescription: "Встановіть нагадування про заняття.\nРегулярні вправи допоможуть досягти результатів!",
    practiceGoal: "Тривалість занятть",
    practiceGoalDescription: "Встановіть заплановану тривалість вправ.\nВи завжди можете це змінити.",
    practiceGoalPickerTitle: "Тривалість Занятть",
    alertTitle: "Сповіщення не підключено",
    alertMessage: "Ви можете увімкнути цю функцію в налаштуваннях.",
    alertButton: "Відкрити Налаштування",

    dates: {
      Sun: "Нед",
      Mon: "Пон",
      Tue: "Вів",
      Wed: "Сер",
      Thu: "Чет",
      Fri: "П’ят",
      Sat: "Суб",
    }
  },
  progressScreen: {
    title: "Прогрес",
    noProgress: "Прогрес відображатиметься тут\nщойно ви додасте перше заняття.",
    sessions: {
      one: "заняття",
      other: "занятть",
    },
    time: "Час",
    days: "Дні",
    activities: "Вправи",
    practiceSessions: "Заняття",
    noPracticeSessions: "Схоже у тебе не було занятть протягом цього часу.",
  },
  sessionDetailsScreen: {
    title: "Заняття",
    deleteSession: "Видалити Запис",
    deleteSessionConfirmation: "Точно видалити?",
    practiceTime: "Тривалість",
    rating: "Рейтинг",
    difficulty: "Складність",
    fun: "Задоволення",
    noFun: "Жахливо",
    categories: "Вправи",
    comments: "Нотатки",
  },
  activityDetailsScreen: {
    practiceTime: "Тривалість",
  },
  practiceForm: {
    title: "Зіграно",
    today: "сьогодні",
    whatPracticed: "Що робили?",
    wasItHard: "Було важко?",
    wasItFun: "Було весело?",
    notes: "Нотатки",
    placeholder: "Додати коментар...",
  },
  activity: {
    songlearning: "Вивчення пісень",
    scales: "Гами",
    arpeggios: "Арпеджіо",
    chords: "Акорди",
    sightreading: "Читання Нот",
    eartraining: "Слух",
    rhythm: "Ритм",
    hanon: "Ханон",
    repertoire: "Репертуар",
    improvisation: "Імпровізація",
    fingerindependence: "Координація",
    composition: "Композиція",
    technique: "Техніка",
    other: "Інще",
  },
  chartControl: {
    week: "Тиждень",
    month: "Місяць",
    year: "Рік",
  },
  progressChart: {
    noData: "Дані відсутні",
  }
}

export default uk
