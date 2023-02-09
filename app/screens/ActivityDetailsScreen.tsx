import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { FlashList } from "@shopify/flash-list"

import { HugeTitle, LargeTitle, MediumTitle } from "@common-ui/components/Text"
import { Spacing } from "@common-ui/constants/spacing"
import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabScreenProps } from "../navigators/MainNavigator"
import { useStores } from "@models/index"
import { Card } from "@common-ui/components/Card"
import { PracticeSession } from "@models/PracticeSession"
import { PracticeItem, PRACTICE_ITEM_HEIGHT } from "@components/PracticeItem"
import { Cell } from "@common-ui/components/Common"
import { useBottomPadding } from "@common-ui/utils/useBottomPadding"
import { ChartControl, ChartMode } from "@components/ChartControl"

type ListHeaderProps = {
  startDay: Date
  endDay: Date
  mode: keyof typeof ChartMode
  sessions: PracticeSession[]
  totalPracticeTime: {
    hours: string
    minutes: string
  }
  onDateRangeChange: (startDate: Date, endDate: Date, mode: keyof typeof ChartMode) => void;
} 

function ListHeader(props: ListHeaderProps) {
  const { startDay, endDay, mode, sessions, totalPracticeTime, onDateRangeChange } = props

  return (
    <Cell bottom={Spacing.large}>
      <Card flex>
        <MediumTitle align="center" bottom={Spacing.small}>
          Practice Time
        </MediumTitle>
        <LargeTitle align="center">
          {totalPracticeTime.hours}hr {totalPracticeTime.minutes}min
        </LargeTitle>
      </Card>
      <ChartControl
        startDate={startDay}
        endDate={endDay}
        mode={mode}
        sessions={sessions}
        onDateRangeChange={onDateRangeChange}
      />
    </Cell>
  )
}

export const ActivityDetailsScreen: FC<MainTabScreenProps<"ActivityDetails">> = observer(
  function ActivityDetailsScreen(props) {
    const { activityId, startDate, endDate, mode } = props.route.params
    const paddingBottom = useBottomPadding()

    const [dateRange, setDateRange] = React.useState<{
      startDay: Date
      endDay: Date,
      chartMode: keyof typeof ChartMode
    }>({
      startDay: new Date(startDate),
      endDay: new Date(endDate),
      chartMode: mode
    })

    const onDateRangeChange = (startDay: Date, endDay: Date, chartMode: keyof typeof ChartMode) => {
      setDateRange({
        startDay,
        endDay,
        chartMode,
      })
    }

    const { practiceSessionStore, activitiesStore } = useStores()

    const activity = activitiesStore.getActivityById(activityId)
    const sessions = practiceSessionStore.getSessionsCompletedBetweenDates(dateRange.startDay, dateRange.endDay, activityId)
    const totalPracticeTime = practiceSessionStore.getTotalPracticeTimeFromSessions(sessions)

    const $flashListContentContainerStyle = { paddingBottom }

    return (
      <Screen>
        <HugeTitle left={Spacing.medium} top={Spacing.large}>
          {activity.name}
        </HugeTitle>
        <Content noPadding>
          <Cell
            flex
            horizontal={Spacing.medium}
            vertical={Spacing.medium}
          >
            <FlashList
              contentContainerStyle={$flashListContentContainerStyle}
              data={sessions}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.uuid}
              renderItem={({ item }) => (
                <PracticeItem item={item} />
              )}
              estimatedItemSize={PRACTICE_ITEM_HEIGHT}
              ListHeaderComponent={() => (
                <ListHeader
                  startDay={dateRange.startDay}
                  endDay={dateRange.endDay}
                  mode={dateRange.chartMode}
                  sessions={sessions}
                  totalPracticeTime={totalPracticeTime}
                  onDateRangeChange={onDateRangeChange}
                />
              )}
            />
          </Cell>
        </Content>
      </Screen>
    )
  }
)
