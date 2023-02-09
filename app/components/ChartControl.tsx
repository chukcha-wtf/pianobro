import React from "react"
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { startOfWeek, endOfWeek, subWeeks, subMonths, subYears, addWeeks, addMonths, addYears, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { runOnJS } from "react-native-reanimated";

import { ProgressChart } from "./ProgressChart";
import { Card } from "@common-ui/components/Card";
import { SegmentControl } from "@common-ui/components/SegmentControl";
import { LabelText } from "@common-ui/components/Text";
import { Spacing } from "@common-ui/constants/spacing";

import { PracticeSession } from "@models/PracticeSession";
import { formatDate, getDateLocale } from "@utils/formatDate"


type ChartControlProps = {
  startDate: Date;
  endDate: Date;
  mode: keyof typeof ChartMode;
  sessions: PracticeSession[];
  onDateRangeChange: (startDate: Date, endDate: Date, mode: keyof typeof ChartMode) => void;
}

export enum ChartMode {
  week = "week",
  month = "month",
  year = "year",
}

type PanDirection = "left" | "right"


const DATE_MODIFIER_FUNCTIONS = {
  week: {
    left: subWeeks,
    right: addWeeks,
    start: startOfWeek,
    end: endOfWeek,
    getTimeRangeText: (startDate: Date, endDate: Date) => {
      const startDateISO = startDate.toISOString()
      const endDateISO = endDate.toISOString()

      const startDay = formatDate(startDateISO, "d")
      const endDay = formatDate(endDateISO, "d")

      const startMonth = formatDate(startDateISO, "MMM")
      const endMonth = formatDate(endDateISO, "MMM")

      const endYear = endDate.getFullYear()
      const todayYear = new Date().getFullYear()

      let text = `${startDay} ${startMonth} - ${endDay} ${endMonth}`

      if (startMonth === endMonth) {
        text = `${startDay} - ${endDay} ${startMonth}`
      }

      if (endYear !== todayYear) {
        text += ` ${endYear}`
      }

      return text
    }
  },
  month: {
    left: subMonths,
    right: addMonths,
    start: startOfMonth,
    end: endOfMonth,
    getTimeRangeText: (startDate: Date, _: Date) => {
      const month = formatDate(startDate.toISOString(), "MMMM")
      const startYear = startDate.getFullYear()
      const todayYear = new Date().getFullYear()
      
      return startYear === todayYear ? month : `${month} ${startYear}`
    }
  },
  year: {
    left: subYears,
    right: addYears,
    start: startOfYear,
    end: endOfYear,
    getTimeRangeText: (startDate: Date, _: Date) => {
      return `${startDate.getFullYear()}`
    }
  },
}

export const getChartStartDate = (mode: keyof typeof ChartMode, date: Date) => {
  return DATE_MODIFIER_FUNCTIONS[mode].start(date, {
    locale: getDateLocale(),
    weekStartsOn: 1,
  })
}

export const getChartEndDate = (mode: keyof typeof ChartMode, date: Date) => {
  return DATE_MODIFIER_FUNCTIONS[mode].end(date, {
    locale: getDateLocale(),
    weekStartsOn: 1,
  })
}

export function ChartControl(props: ChartControlProps) {
  const { startDate, mode, sessions, endDate, onDateRangeChange } = props

    const changeMode = (newMode: keyof typeof ChartMode) => {
      const newStartDate = getChartStartDate(newMode, new Date())
      const newEndDate = getChartEndDate(newMode, new Date())

      onDateRangeChange(newStartDate, newEndDate, newMode)
    }

    const modifyStartAndEndDate = (panDirection: PanDirection) => {
      const newStartDate = DATE_MODIFIER_FUNCTIONS[mode][panDirection](startDate, 1)
      const newEndDate = DATE_MODIFIER_FUNCTIONS[mode][panDirection](endDate, 1)

      // Do not attempt to scroll to the future
      if (newStartDate.getTime() > new Date().getTime()) {
        return
      }
      
      onDateRangeChange(newStartDate, newEndDate, mode)
    }


  const swipeGesture = Gesture.Pan().onEnd((event) => {
    if (event.translationX > 0) {
      runOnJS(modifyStartAndEndDate)("left")
    } else {
      runOnJS(modifyStartAndEndDate)("right")
    }
  })

  const chartTimeRangeText = DATE_MODIFIER_FUNCTIONS[mode].getTimeRangeText(startDate, endDate)

  return (
    <>
      <SegmentControl
        capitalize
        innerHorizontal={Spacing.larger}
        top={Spacing.large}
        segments={["week", "month", "year"]}
        selectedSegment={mode}
        onChange={changeMode}
      />
      <Card top={Spacing.extraSmall}>
        <GestureDetector gesture={swipeGesture}>
          <ProgressChart
            mode={mode}
            startDate={startDate}
            sessions={sessions}
          />
        </GestureDetector>
        <LabelText align="center" top={Spacing.tiny}>
          {chartTimeRangeText}
        </LabelText>
      </Card>
    </>
  )
}
