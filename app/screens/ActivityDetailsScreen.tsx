import React, { FC, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { FlashList } from "@shopify/flash-list"

import { LargeTitle, MediumText, MediumTitle } from "@common-ui/components/Text"
import { Spacing } from "@common-ui/constants/spacing"
import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabScreenProps } from "../navigators/MainNavigator"
import { useStores } from "@models/index"
import { Card } from "@common-ui/components/Card"
import { PracticeSession } from "@models/PracticeSession"
import { PracticeItem, PRACTICE_ITEM_HEIGHT } from "@components/PracticeItem"
import { AbsoluteContainer, Cell, Row } from "@common-ui/components/Common"
import { useBottomPadding } from "@common-ui/utils/useBottomPadding"
import { ChartControl, ChartMode } from "@components/ChartControl"
import { LinkButton } from "@common-ui/components/Button"
import { Colors } from "@common-ui/constants/colors"
import { formatDateRangeText } from "@utils/formatDateRangeText"

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

// ScrollView have some weird UI glitch where it tends to cut about 1px to the right
// of the list. This is a hack to fix that. We first cut the right padding of the container
// by 2px, then we add a padding to the list item to make up for the lost 2px.
export const FLASH_LIST_OFFSET = 2

function ListHeader(props: ListHeaderProps) {
  const { startDay, endDay, mode, sessions, practiceGoal, totalPracticeTime, onDateRangeChange } = props

  const title = useMemo(() => {
    return formatDateRangeText(startDay, endDay, mode)
  }, [startDay, endDay, mode])

  return (
    <Cell top={Spacing.medium} bottom={Spacing.large} right={FLASH_LIST_OFFSET}>
      <MediumText bottom={Spacing.medium}>
        {title}
      </MediumText>
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

    const activity = useMemo(
      () => activitiesStore.getActivityById(activityId),
      [activityId]
    )
    const sessions = practiceSessionStore.getSessionsCompletedBetweenDates(dateRange.startDay, dateRange.endDay, activityId)
    
    const totalPracticeTime = useMemo(
      () => practiceSessionStore.getTotalPracticeTimeFromSessions(sessions),
      [sessions]
    )

    const $flashListContentContainerStyle = { paddingBottom }

    return (
      <Screen bgColor={Colors.grayBackground}>
        <Row align="center" justify="center" height={Spacing.button} bottom={Spacing.extraSmall}>
          <AbsoluteContainer sticks={['left']}>
            <LinkButton
              icon="chevron-left"
              iconSize={Spacing.larger}
              textColor={Colors.dark}
              onPress={props.navigation.goBack}
              innerLeft={Spacing.small}
            />
          </AbsoluteContainer>
          <MediumText>
            {activity.name}
          </MediumText>
        </Row>

        <Content bgColor={Colors.grayBackground} noPadding>
          <Cell
            flex
            left={Spacing.medium}
            right={Spacing.medium - FLASH_LIST_OFFSET}
            bottom={Spacing.medium}
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
