import React, { useMemo } from "react"
import { Dimensions } from "react-native"
import { processFontFamily } from "expo-font"

import { DomainTuple } from "victory-core"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine, VictoryLabel } from "victory-native"
import { addDays, addMonths, endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns"

import { Spacing } from "@common-ui/constants/spacing"
import { Colors } from "@common-ui/constants/colors"
import { Fonts } from "@common-ui/constants/typography"
import { calculateDuration } from "@utils/calculateDuration"
import { convertMilisecondsToHours, formatDate } from "@utils/formatDate"
import { PracticeSession } from "@models/PracticeSession"
import { ChartMode } from "./ChartControl"

type ProgressChartProps = {
  daysPracticed: Map<string, number>;
  mode: keyof typeof ChartMode
  startDate?: Date
  practiceGoal: number;
}

const CHART_HEIGHT = 200
// Window width - screen padding (Spacing.medium * 2) - card padding (Spacing.medium * 2) - border width (2 * 2)
const CHART_WIDTH = Dimensions.get("window").width - Spacing.medium * 4 - 4

type BarData = {
  x: number,
  y: number,
  day: string,
  fill: string,
}

const CHART_SETTINGS = {
  week: {
    tickCount: 7,
    barWidth: 20,
    tickLabelFontSize: 10,
    timeTickLabelFontSize: 12,
    getLength: () => 7,
    addFunction: addDays,
    compareDateStartFunction: startOfDay,
    compareDateEndFunction: endOfDay,
    formatFunction: (date: string) => formatDate(date, "EEE"),
  },
  month : {
    barWidth: 5,
    tickCount: 10,
    tickLabelFontSize: 10,
    timeTickLabelFontSize: 12,
    getLength: (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
    addFunction: addDays,
    compareDateStartFunction: startOfDay,
    compareDateEndFunction: endOfDay,
    formatFunction: (date: string) => formatDate(date, "d"),
  },
  year: {
    barWidth: 12,
    tickCount: 12,
    tickLabelFontSize: 8,
    timeTickLabelFontSize: 10,
    getLength: () => 12,
    addFunction: addMonths,
    compareDateStartFunction: startOfMonth,
    compareDateEndFunction: endOfMonth,
    formatFunction: (date: string) => formatDate(date, "MMM"),
  },
}

function getBarColor(value: number, goal?: number): string {
  if (goal) {
    if (value > goal) {
      return Colors.chartBarOver
    }
  
    if (value < goal * 0.8) {
      return Colors.chartBarUnder
    }
  }

  return Colors.chartBarNormal
}

function aggregateFunction(
  session: PracticeSession,
  date: Date,
  mode: keyof typeof ChartMode,
): number {
  const sessionStart = new Date(session.startTime)
  const sessionEnd = new Date(session.endTime)
  const sessionStartMils = sessionStart.getTime()
  const sessionEndMils = sessionEnd.getTime()
  const dateToCompareStart = CHART_SETTINGS[mode].compareDateStartFunction(date)
  const dateToCompareEnd = CHART_SETTINGS[mode].compareDateEndFunction(date)
  const dateToCompareMils = dateToCompareStart.getTime()
  const endOfDayTimeMils = dateToCompareEnd.getTime() 

  // If the session is in the current date range, add its duration to the totalPlayedMils
  // There are five possible scenarios:
  // 1. The session is within one day and in the current date range
  // 2. The session is longer than one day and starts today
  // 3. The session is longer than one day and starts before today and ends after today
  // 4. The session is longer than one day and ends today
  // 5. The session is outside the current date range

  // 1. The session is within one day and in the current date range
  if (sessionStartMils >= dateToCompareMils && sessionEndMils <= endOfDayTimeMils) {
    return session.duration
  }

  // 2. The session is longer than one day and starts today
  else if (sessionStartMils >= dateToCompareMils && sessionEndMils >= endOfDayTimeMils && sessionStartMils <= endOfDayTimeMils) {
    const rangeDuration = calculateDuration(sessionStart.toISOString(), dateToCompareEnd.toISOString())
    return rangeDuration
  }
  
  // 3. The session is longer than one day and starts before today and ends after today
  else if (sessionStartMils <= dateToCompareMils && sessionEndMils >= endOfDayTimeMils) {
    const rangeDuration = calculateDuration(dateToCompareStart.toISOString(), dateToCompareEnd.toISOString())
    return rangeDuration
  }
  // 4. The session is longer than one day and ends today
  else if (sessionStartMils <= dateToCompareMils && sessionEndMils <= endOfDayTimeMils && sessionEndMils >= dateToCompareMils) {
    const rangeDuration = calculateDuration(dateToCompareStart.toISOString(), sessionEnd.toISOString())
    return rangeDuration
  }
  
  // 5. The session is outside the current date range
  return 0
}

function getDurationForDate(
  date: Date,
  daysPractice: Map<string, number>,
  mode: keyof typeof ChartMode,
): number {
  const year = date.getFullYear().toString()
  const month = date.getMonth().toString()
  const day = date.getDate().toString()

  let duration = daysPractice.get(`${year}.${month}.${day}`) || 0

  // If the mode is "year" we need to aggregate daily durations into monthly durations
  if (mode === "year") {
    duration = Array.from(daysPractice.keys()).filter((key) => {
      const [keyYear, keyMonth] = key.split(".")
      return keyYear === year && keyMonth === month
    }).reduce((total, key) => {
      return total + daysPractice.get(key)
    }, 0)
  }

  return duration
}

// Only "week" mode is implemented for now
function buildData(
  daysPracticed: Map<string, number>,
  mode: keyof typeof ChartMode,
  goal?: number,
  startDate?: Date,
): [BarData[], number] {
  const data: BarData[] = []
  let maxXValue = 1 // Default to 1 so that the chart doesn't look weird when there are no sessions

  const arrayLength = CHART_SETTINGS[mode].getLength(startDate)

  let date = startOfDay(new Date(startDate))
  
  // Fill the data array with empty values
  for (let i = 0; i < arrayLength; i++) {
    const totalPlayedMils = getDurationForDate(date, daysPracticed, mode)

    const hoursPlayed = convertMilisecondsToHours(totalPlayedMils) || 0
    const day = CHART_SETTINGS[mode].formatFunction(date.toISOString())

    data.push({
      x: i,
      y: hoursPlayed,
      day,
      fill: getBarColor(hoursPlayed, goal),
    })

    // Set max value for the x axis
    if (hoursPlayed > maxXValue) {
      maxXValue = hoursPlayed
    }

    date = CHART_SETTINGS[mode].addFunction(date, 1)
  }
  
  return [data, Math.ceil(maxXValue)]
}

export function ProgressChart(props: ProgressChartProps) {
  const { daysPracticed, mode, startDate, practiceGoal } = props

  const goalTime = (practiceGoal ?? 0) / 60 // Convert to hours
  
  const [data, maxXValue] = buildData(daysPracticed, mode, goalTime, startDate)

  const goalLineStart = data.length ? data[0].x + 0.5 : 0
  const goalLineEnd = data.length ? data[data.length - 1].x + 1.5 : 0
  const goalLineStrokeConfig: DomainTuple = [goalLineStart, goalLineEnd]

  // Build nice tick values for the vertical axis
  const verticalTickValues = new Array(Math.ceil(maxXValue) + 1).fill(0).map((_, i) => i)

  let maxDomainTime: number
  const baseDomainNumber = 1.8
  
  switch(true) {
    case !!data.length:
      maxDomainTime = data[data.length - 1].y || baseDomainNumber
      break;
    case !!goalTime:
      maxDomainTime = goalTime || baseDomainNumber
      break;
    default:
      maxDomainTime = baseDomainNumber
      break;
  }

  const fontFamilyGrotesk = processFontFamily(Fonts.spaceGrotesk.medium)
  const $labelStyles = {
    ...$labelStyle,
    fontFamily: fontFamilyGrotesk,
  }

  return (
    <VictoryChart
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      padding={{ top: Spacing.tiny, bottom: Spacing.larger, left: Spacing.larger, right: Spacing.small }}
      >
      <VictoryBar
        data={data}
        cornerRadius={{ top: Spacing.tiny, bottom: Spacing.tiny }}
        x="day"
        style={{
          data: {
            fill: ({ datum }) => datum.fill,
            width: CHART_SETTINGS[mode].barWidth,
            borderRadius: Spacing.tiny,
          },
        }}
        labels={daysPracticed.size ? [""] : ["No data"]}
        labelComponent={
          <VictoryLabel
            textAnchor="middle"
            verticalAnchor="middle"
            dx={CHART_WIDTH / 3}
            dy={-CHART_HEIGHT / 2.5}
            style={$labelStyles}
          />
        }

      />
      <VictoryAxis
        tickCount={CHART_SETTINGS[mode].tickCount}
        style={{
          axis: { stroke: "transparent" },
          tickLabels: {
            ...$tickLabelStyle,
            fontFamily: processFontFamily(Fonts.spaceGrotesk.medium),
            fontSize: CHART_SETTINGS[mode].tickLabelFontSize,
          },
        }}
      />
      <VictoryAxis
        dependentAxis
        scale="time"
        domain={[0, maxDomainTime]}
        tickFormat={(t) => `${t}h`}
        tickValues={verticalTickValues}
        tickCount={4}
        style={{
          axis: { stroke: "transparent" },
          tickLabels: {
            ...$timeTickLabelStyle,
            fontFamily: processFontFamily(Fonts.spaceGrotesk.medium),
            fontSize: CHART_SETTINGS[mode].timeTickLabelFontSize,
          },
        }}
      />
      <VictoryLine
        domain={{ x: goalLineStrokeConfig }}
        style={{
          data: {
            stroke: goalTime ? "rgba(0,0,0,0.1)" : "transparent",
            strokeDasharray: "8 4",
            strokeWidth: "1"
          }
        }}
        y={() => goalTime}
      />
    </VictoryChart>
  )
}

const $labelStyle = {
  fontSize: Spacing.large,
  fontWeight: "normal",
  fill: "rgba(0,0,0,0.4)",
}

const $tickLabelStyle = {
  fontSize: 10,
  fontWeight: "normal",
  fill: "rgba(0,0,0,0.4)",
  padding: Spacing.extraSmall,
}

const $timeTickLabelStyle = {
  fontSize: 12,
  fontWeight: "normal",
  fill: "rgba(0,0,0,0.4)",
  padding: 5
}
