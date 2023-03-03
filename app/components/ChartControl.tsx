import React from "react"
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { startOfWeek, endOfWeek, subWeeks, subMonths, subYears, addWeeks, addMonths, addYears, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"

import { ProgressChart } from "./ProgressChart";
import { Card } from "@common-ui/components/Card";
import { SegmentControl } from "@common-ui/components/SegmentControl";
import { Spacing } from "@common-ui/constants/spacing";

import { getDateLocale } from "@utils/formatDate"
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { InteractionManager } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Timing } from "@common-ui/constants/timing";
import { translate } from "@i18n/translate";


type ChartControlProps = {
  startDate: Date;
  endDate: Date;
  mode: keyof typeof ChartMode;
  practiceGoal: number;
  daysPracticed: Map<string, number>;
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
  },
  month: {
    left: subMonths,
    right: addMonths,
    start: startOfMonth,
    end: endOfMonth,
  },
  year: {
    left: subYears,
    right: addYears,
    start: startOfYear,
    end: endOfYear,
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
  const { startDate, endDate, practiceGoal, mode, daysPracticed, onDateRangeChange } = props
  
  const changeMode = (newMode: keyof typeof ChartMode) => {
    // When changing modes - always stick to current time period
    const newStartDate = getChartStartDate(newMode, new Date())
    const newEndDate = getChartEndDate(newMode, newStartDate)

    InteractionManager.runAfterInteractions(() => {
      onDateRangeChange(newStartDate, newEndDate, newMode)
    })
  }

  const modifyStartAndEndDate = (panDirection: PanDirection) => {
    const newStartDate = DATE_MODIFIER_FUNCTIONS[mode][panDirection](startDate, 1)
    const newEndDate = DATE_MODIFIER_FUNCTIONS[mode][panDirection](endDate, 1)

    // Do not attempt to scroll to the future
    if (newStartDate.getTime() > new Date().getTime()) {
      return
    }
    
    InteractionManager.runAfterInteractions(() => {
      onDateRangeChange(newStartDate, newEndDate, mode)
    })
  }

  const swipeGesture = Gesture.Pan().runOnJS(true).onEnd((event) => {
    // Do nothing if it wasn't really a swipe left or right
    // (i.e. if the user just tapped the chart)
    if (Math.abs(event.translationX) < WINDOW_WIDTH * 0.2) {
      return
    }

    if (event.translationX > 0) {
      modifyStartAndEndDate("left")
    } else {
      modifyStartAndEndDate("right")
    }
  })

  const segments = [
    { key: "week", title: translate("chartControl.week") },
    { key: "month", title: translate("chartControl.month") },
    { key: "year", title: translate("chartControl.year") },
  ]

  return (
    <>
      <SegmentControl
        innerHorizontal={Spacing.larger}
        top={Spacing.large}
        segments={segments}
        selectedSegment={mode}
        onChange={changeMode}
      />
      <Card top={Spacing.extraSmall}>
        <Animated.View entering={FadeInLeft.delay(Timing.fast)}>
          <GestureDetector gesture={swipeGesture}>
            <ProgressChart
              mode={mode}
              practiceGoal={practiceGoal}
              startDate={startDate}
              daysPracticed={daysPracticed}
            />
          </GestureDetector>
        </Animated.View>
      </Card>
    </>
  )
}
