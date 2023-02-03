import React from "react"
import { BarChart } from "react-native-chart-kit"
import { PracticeSession } from "@models/PracticeSession"
import { Dimensions } from "react-native"
import { Spacing } from "@common-ui/constants/spacing"
import { Colors } from "@common-ui/constants/colors"
import { convertMilisecondsToHours, formatDate } from "@utils/formatDate"

type ProgressChartProps = {
  sessions: PracticeSession[]
  mode: "week" | "month" | "year"
  startDate?: Date
  endDate?: Date
}

const CHART_HEIGHT = 200
// Window width - screen padding (Spacing.medium * 2) - card padding (Spacing.medium * 2) - border width (2 * 2)
const CHART_WIDTH = Dimensions.get("window").width - Spacing.medium * 4 - 4

// Only "week" mode is implemented for now
function buildData(
  sessions: PracticeSession[],
  mode: "week" | "month" | "year",
  startDate?: Date,
  endDate?: Date
) {
  const dateRangeObject = {}

  const sessionsByDay = sessions.reduce((acc, session) => {
    const day = new Date(session.endTime).toDateString()
    if (acc[day]) {
      acc[day] += session.duration
    } else {
      acc[day] = session.duration
    }
    return acc
  }, {} as { [key: string]: number })

  const beginningDate = new Date(startDate)
  // beginningDate is modified in the loop
  // eslint-disable-next-line no-unmodified-loop-condition
  while (beginningDate.getTime() < endDate.getTime()) {
    const day = beginningDate.toDateString()
    
    dateRangeObject[day] = convertMilisecondsToHours(sessionsByDay[day]) || 0
    
    beginningDate.setDate(beginningDate.getDate() + 1)
  }

  const labels = Object.keys(dateRangeObject).map((dateString) => {
    return formatDate(new Date(dateString).toISOString(), "EEE")
  })

  const data = Object.values(dateRangeObject)

  const dataObject = {
    datasets: [
      { data }
    ],
    labels,
  }

  return dataObject
}

export function ProgressChart(props: ProgressChartProps) {
  const { sessions, mode, startDate, endDate } = props

  const data = buildData(sessions, mode, startDate, endDate)

  const chartConfig = {
    backgroundColor: Colors.white,
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    fillShadowGradientFrom: Colors.warning,
    fillShadowGradientTo: Colors.warning,
    fillShadowGradientOpacity: 1,
    backgroundGradientFromOpacity: 1,
    backgroundGradientToOpacity: 1,
    strokeWidth: 1,
    barRadius: 1,
    barPercentage: 0.5,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(71, 74, 87, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(71, 74, 87, ${opacity})`,
    propsForLabels: {
      fontSize: 12,
    }
  }

  return (
    <BarChart
      data={data}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      decimalPlaces={0}
      barPercentage={0.5}
      showBarTops={false}
      hideLegend
      withHorizontalLabels
      withVerticalLabels
      chartConfig={chartConfig}
    />
  )
}
