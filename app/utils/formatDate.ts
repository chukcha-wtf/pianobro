import { Locale, format, parseISO } from "date-fns"
import I18n from "i18n-js"

import uk from "date-fns/locale/uk"
import en from "date-fns/locale/en-US"

type Options = Parameters<typeof format>[2]

const getLocale = (): Locale => {
  const locale = I18n.currentLocale().split("-")[0]
  return locale === "uk" ? uk : en
}

export const formatDate = (date: string, dateFormat?: string, options?: Options) => {
  const locale = getLocale()
  const dateOptions = {
    ...options,
    locale,
  }
  return format(parseISO(date), dateFormat ?? "MMM dd, yyyy", dateOptions)
}

export const formatTime = (date: string, dateFormat?: string, options?: Options) => {
  const locale = getLocale()
  const dateOptions = {
    ...options,
    locale,
  }
  return format(parseISO(date), dateFormat ?? "hh:mm a", dateOptions)
}

export const formatDateTime = (date: string, dateFormat?: string, options?: Options) => {
  const locale = getLocale()
  const dateOptions = {
    ...options,
    locale,
  }
  return format(parseISO(date), dateFormat ?? "hh:mm a MMM dd, yyyy", dateOptions)
}

export const formatDuration = (duration: number) => {
  const milliseconds = Number(duration)
  const seconds = Math.floor(milliseconds / 1000)

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secondsLeft = Math.floor((seconds % 3600) % 60)

  const hoursFormatted = hours > 0 ? `${hours}h` : "00h"
  const minutesFormatted = minutes > 0 ? `${minutes}m` : "00m"
  const secondsFormatted = secondsLeft > 0 ? `${secondsLeft}s` : "00s"

  return { hours: hoursFormatted, minutes: minutesFormatted, seconds: secondsFormatted }
}
