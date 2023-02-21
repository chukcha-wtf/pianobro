/**
 * Function to format date range text
 * @param {Date | string} startDate
 * @param {Date | string | undefined} endDate
 * @param {string} mode
 * @returns {string}
 * 
 * @example
 * formatDateRangeText(new Date("2021-01-01"), new Date("2021-01-31"), "month")
 * // => "January 2021"
 * 
 * formatDateRangeText(new Date("2021-01-01"), new Date("2021-01-31"), "year")
 * // => "2021"
 * 
 * formatDateRangeText(new Date("2021-01-01"), new Date("2021-01-31"), "week")
 * // => "1 Jan - 31 Jan"
 */

import { formatDate, formatDateTime } from "./formatDate"

export const formatDateRangeText = (startDate: Date | string, endDate: Date | string | undefined, mode: "week" | "month" | "year") => {
  const startDateObj = new Date(startDate)
  const endDateObj = endDate ? new Date(endDate) : new Date()
  
  const today = new Date()
  const todayYear = new Date().getFullYear()
  const startYear = startDateObj.getFullYear()

  const startDateMs = startDateObj.getTime()
  const endDateMs = endDateObj.getTime()
  const todayMs = today.getTime()
  
  if (mode === "week") {
    const startDateISO = startDateObj.toISOString()
    const endDateISO = endDateObj.toISOString()

    const startDay = formatDate(startDateISO, "d")
    const endDay = formatDate(endDateISO, "d")

    const startMonth = formatDate(startDateISO, "MMM")
    const endMonth = formatDate(endDateISO, "MMM")

    const endYear = endDateObj.getFullYear()

    let text = `${startDay} ${startMonth} - ${endDay} ${endMonth}`

    if (endDateMs >= todayMs && startDateMs <= todayMs) {
      return "This Week"
    }

    if (startDay === endDay && startMonth === endMonth) {
      const startTime = formatDateTime(startDateISO, "hh:mm a")
      const endTime = formatDateTime(endDateISO, "hh:mm a")

      text = `${startTime} - ${endTime}, ${startDay} ${startMonth}`
    }
    else if (startMonth === endMonth) {
      text = `${startDay} - ${endDay} ${startMonth}`
    }

    if (endYear !== todayYear) {
      text += ` ${endYear}`
    }

    return text
  }

  if (mode === "month") {
    const month = formatDate(startDateObj.toISOString(), "MMMM")

    if (startYear === todayYear) {
      if (startDateMs <= todayMs && endDateMs >= todayMs) {
        return "This Month"
      }

      return month
    }
    
    return `${month} ${startYear}`
  }

  if (mode === "year") {
    return startYear === todayYear ? "This Year" : `${startYear}`
  }

  return `${formatDateTime(startDateObj.toISOString(), "MMM dd, hh:mm a")} - ${formatDateTime(endDateObj.toISOString(), "MMM dd, hh:mm a")}`
}