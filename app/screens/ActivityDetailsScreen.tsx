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
  practiceGoal: number
  totalPracticeTime: {
    hours: string
    minutes: string
  }
  onDateRangeChange: (startDate: Date, endDate: Date, mode: keyof typeof ChartMode) => void;
}

// Flash list have some weird UI glitch where it tends to cut about 1px to the right
// of the list. This is a hack to fix that. We first cut the right padding of the container
// by 2px, then we add a padding to the list item to make up for the lost 2px.
export const FLASH_LIST_OFFSET = 2

function ListHeader(props: ListHeaderProps) {
  const { startDay, endDay, mode, sessions, practiceGoal, totalPracticeTime, onDateRangeChange } = props

  return (
    <Cell bottom={Spacing.large} right={FLASH_LIST_OFFSET}>
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
        practiceGoal={practiceGoal}
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

    const { practiceSessionStore, activitiesStore, remindersStore } = useStores()

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
            left={Spacing.medium}
            right={Spacing.medium - FLASH_LIST_OFFSET}
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
                  practiceGoal={remindersStore.goal}
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
