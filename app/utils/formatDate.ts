import { Locale, format, parseISO } from "date-fns"
import I18n from "i18n-js"

import uk from "date-fns/locale/uk"
import en from "date-fns/locale/en-US"
import { getCalendars } from "expo-localization"

type Options = Parameters<typeof format>[2]
export type DurationObject = {
  hours: string
  minutes: string
  seconds: string
}

export const getDateLocale = (): Locale => {
  const locale = I18n.currentLocale().split("-")[0]
  return locale === "uk" ? uk : en
}

export const getTimeFormat = (): string => {
  return getCalendars()[0]?.uses24hourClock ? "HH:mm" : "hh:mm a"
}

export const getDateTimeFormat = (): string => {
  return getCalendars()[0]?.uses24hourClock ? "HH:mm MMM dd, yyyy" : "hh:mm a MMM dd, yyyy"
}

export const formatDate = (date: string, dateFormat?: string, options?: Options) => {
  const locale = getDateLocale()

  const dateOptions = {
    ...options,
    locale,
  }

  return format(parseISO(date), dateFormat ?? "MMM dd, yyyy", dateOptions)
}

export const formatTime = (date: string, dateFormat?: string, options?: Options) => {
  const locale = getDateLocale()
  const dateOptions = {
    ...options,
    locale,
  }

  return format(parseISO(date), dateFormat ?? getTimeFormat(), dateOptions)
}

export const formatDateTime = (date: string, dateFormat?: string, options?: Options) => {
  const locale = getDateLocale()
  const dateOptions = {
    ...options,
    locale,
  }

  return format(parseISO(date), dateFormat ?? getDateTimeFormat(), dateOptions)
}

export function convertMilisecondsToHours(miliseconds: number): number {
  return miliseconds / 1000 / 60 / 60
}

const prettifyTime = (time: number): string => {
  return time < 10 ? `0${time}` : `${time}`
}

export const formatDuration = (duration: number): DurationObject => {
  const milliseconds = Number(duration)
  const seconds = Math.floor(milliseconds / 1000)

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secondsLeft = Math.floor((seconds % 3600) % 60)

  const hoursFormatted = hours > 0 ? `${hours}` : "0"
  const minutesFormatted = minutes > 0 ? `${prettifyTime(minutes)}` : "00"
  const secondsFormatted = secondsLeft > 0 ? `${prettifyTime(secondsLeft)}` : "00"

  const durationObject: DurationObject = {
    hours: hoursFormatted,
    minutes: minutesFormatted,
    seconds: secondsFormatted
  }

  return durationObject
}
