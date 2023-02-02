import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { startOfWeek, endOfWeek } from "date-fns"

import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabScreenProps, ROUTES } from "../navigators/MainNavigator"
import { HugeTitle, LargeTitle, MediumText, MediumTitle } from "@common-ui/components/Text"
import { translate } from "@i18n/translate"
import { Spacing } from "@common-ui/constants/spacing"
import { useStores } from "@models/index"
import { If } from "@common-ui/components/Conditional"
import { Card } from "@common-ui/components/Card"
import { Row } from "@common-ui/components/Common"
import { ProgressChart } from "@components/ProgressChart"
import { getDateLocale } from "@utils/formatDate"
import { TouchableOpacity } from "react-native-gesture-handler"

export const StatisticsScreen: FC<MainTabScreenProps<"Statistics">> = observer(
  function StatisticsScreen(props) {
    const { navigation } = props
    const { practiceSessionStore } = useStores()

    const startDay = startOfWeek(new Date(), {
      locale: getDateLocale(),
      weekStartsOn: 1
    })
    const endDay = endOfWeek(new Date(), {
      locale: getDateLocale(),
      weekStartsOn: 1
    })

    const sessionsCompletedThisWeek = practiceSessionStore.getSessionsCompletedBetweenDates(startDay, endDay)
    const activities = practiceSessionStore.getActivitiesFromSessions(sessionsCompletedThisWeek)
    const daysPracticed = practiceSessionStore.getDaysWithCompletedSessions(sessionsCompletedThisWeek)
    const totalPracticeTime = practiceSessionStore.getTotalPracticeTimeFromSessions(sessionsCompletedThisWeek)

    return (
      <Screen>
        <HugeTitle left={Spacing.medium} top={Spacing.large} text={translate("statisticsScreen.title")} />
        <Content scrollable={practiceSessionStore.hasCompletedSessions}>
          <If condition={!practiceSessionStore.hasCompletedSessions}>
            <LargeTitle align="center">
              You have no completed practice sessions yet.
            </LargeTitle>
          </If>
          <If condition={practiceSessionStore.hasCompletedSessions}>
            <MediumText vertical={Spacing.large} bottom={Spacing.extraSmall}>
              This Week
            </MediumText>
            <Row align="space-between">
              <Card flex>
                <MediumTitle align="center" bottom={Spacing.small}>
                  Time
                </MediumTitle>
                <LargeTitle align="center">
                  {totalPracticeTime.hours}hr {totalPracticeTime.minutes}min
                </LargeTitle>
              </Card>
              <Card flex left={Spacing.medium}>
                <MediumTitle align="center" bottom={Spacing.small}>
                  Days
                </MediumTitle>
                <LargeTitle align="center">
                  {daysPracticed.length}
                </LargeTitle>
              </Card>
            </Row>
            <Card top={Spacing.large}>
              <ProgressChart
                mode="week"
                startDate={startDay}
                endDate={endDay}
                sessions={sessionsCompletedThisWeek}
              />
            </Card>
            <MediumText vertical={Spacing.large} bottom={Spacing.extraSmall}>
              Activities
            </MediumText>
            {activities.map((activity) => {
              const openActivityScreen = () => {
                navigation.navigate(ROUTES.ActivityDetails, {
                  activityId: activity.key
                })
              }

              return (
                <Card nonElevated key={activity.key} bottom={Spacing.large}>
                  <TouchableOpacity onPress={openActivityScreen}>
                    <Row align="space-between">
                      <MediumTitle align="center">
                        {activity.humanTitle}
                      </MediumTitle>
                      <LargeTitle align="center">
                        {activity.duration.hours}hr {activity.duration.minutes}min
                      </LargeTitle>
                    </Row>
                  </TouchableOpacity>
                </Card>
              )
            })}
          </If>
        </Content>
      </Screen>
    )
  }
)