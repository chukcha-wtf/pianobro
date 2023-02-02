import React, { FC } from "react"

import { HugeTitle, LargeTitle, MediumTitle } from "@common-ui/components/Text"
import { Spacing } from "@common-ui/constants/spacing"
import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabScreenProps } from "../navigators/MainNavigator"
import { observer } from "mobx-react-lite"
import { useStores } from "@models/index"
import { endOfWeek, startOfWeek } from "date-fns"
import { getDateLocale } from "@utils/formatDate"
import { Card } from "@common-ui/components/Card"
import { ProgressChart } from "@components/ProgressChart"
import { PracticeSession } from "@models/PracticeSession"
import { FlashList } from "@shopify/flash-list"
import { PracticeItem, PRACTICE_ITEM_HEIGHT } from "@components/PracticeItem"
import { Cell } from "@common-ui/components/Common"
import { useBottomPadding } from "@common-ui/utils/useBottomPadding"

type ListHeaderProps = {
  startDay: Date
  endDay: Date
  sessions: PracticeSession[]
  totalPracticeTime: {
    hours: string
    minutes: string
  }
} 

function ListHeader(props: ListHeaderProps) {
  const { startDay, endDay, sessions, totalPracticeTime } = props

  return (
    <>
      <Card flex>
        <MediumTitle align="center" bottom={Spacing.small}>
          Practice Time
        </MediumTitle>
        <LargeTitle align="center">
          {totalPracticeTime.hours}hr {totalPracticeTime.minutes}min
        </LargeTitle>
      </Card>
      <Card vertical={Spacing.large}>
        <ProgressChart
          mode="week"
          startDate={startDay}
          endDate={endDay}
          sessions={sessions}
        />
      </Card>
    </>
  )
}

export const ActivityDetailsScreen: FC<MainTabScreenProps<"ActivityDetails">> = observer(
  function ActivityDetailsScreen(props) {
    const { activityId } = props.route.params
    const paddingBottom = useBottomPadding()

    const { practiceSessionStore, activitiesStore } = useStores()

    const startDay = startOfWeek(new Date(), {
      locale: getDateLocale(),
      weekStartsOn: 1
    })
    const endDay = endOfWeek(new Date(), {
      locale: getDateLocale(),
      weekStartsOn: 1
    })

    const activity = activitiesStore.getActivityById(activityId)
    const sessions = practiceSessionStore.getSessionsCompletedBetweenDates(startDay, endDay, activityId)
    const daysPracticed = practiceSessionStore.getDaysWithCompletedSessions(sessions)
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
                  startDay={startDay}
                  endDay={endDay}
                  sessions={sessions}
                  totalPracticeTime={totalPracticeTime}
                />
              )}
            />
          </Cell>
        </Content>
      </Screen>
    )
  }
)
