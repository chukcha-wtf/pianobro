import React, { FC } from "react"
import { observer } from "mobx-react-lite"

import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabParamList, MainTabScreenProps } from "../navigators/MainNavigator"
import { ROUTES } from "@navigators/AppNavigator"
import { HugeTitle, LargeTitle, MediumText, MediumTitle } from "@common-ui/components/Text"
import { translate } from "@i18n/translate"
import { Spacing } from "@common-ui/constants/spacing"
import { useStores } from "@models/index"
import { If } from "@common-ui/components/Conditional"
import { Card } from "@common-ui/components/Card"
import { Row } from "@common-ui/components/Common"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { NavigationProp } from "@react-navigation/native"
import { AggregatedActivity } from "@models/PracticeSessionStore"
import { ChartControl, ChartMode, getChartEndDate, getChartStartDate } from "@components/ChartControl"

type ActivityItemProps = {
  activity: AggregatedActivity
  navigation: NavigationProp<MainTabParamList>
  startDate: Date
  endDate: Date
  mode: keyof typeof ChartMode
}

function ActivityItem({ activity, startDate, endDate, mode, onDateRangeChange, navigation}: ActivityItemProps) {
  const openActivityScreen = () => {
    navigation.navigate(ROUTES.ActivityDetails, {
      activityId: activity.key,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      mode,
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
}

export const StatisticsScreen: FC<MainTabScreenProps<"Statistics">> = observer(
  function StatisticsScreen(props) {
    const { navigation } = props
    const { practiceSessionStore, remindersStore } = useStores()
    
    const [dateRange, setDateRange] = React.useState<{
      startDate: Date
      endDate: Date,
      mode: keyof typeof ChartMode
    }>({
      startDate: getChartStartDate(ChartMode.week, new Date()),
      endDate: getChartEndDate(ChartMode.week, new Date()),
      mode: ChartMode.week,
    })

    const onDateRangeChange = (startDate: Date, endDate: Date, mode: keyof typeof ChartMode) => {
      setDateRange({
        startDate,
        endDate,
        mode,
      })
    }

    const sessionsCompletedThisWeek = practiceSessionStore.getSessionsCompletedBetweenDates(dateRange.startDate, dateRange.endDate)
    const activities = practiceSessionStore.getActivitiesFromSessions(sessionsCompletedThisWeek)
    const daysPracticed = practiceSessionStore.getDaysWithCompletedSessions(sessionsCompletedThisWeek)
    const totalPracticeTime = practiceSessionStore.getTotalPracticeTimeFromSessions(sessionsCompletedThisWeek)

    return (
      <Screen bgColor={Colors.grayBackground}>
        <HugeTitle left={Spacing.medium} top={Spacing.large} text={translate("statisticsScreen.title")} />
        <Content bgColor={Colors.grayBackground} scrollable={practiceSessionStore.hasCompletedSessions}>
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
            <ChartControl
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              mode={dateRange.mode}
              practiceGoal={remindersStore.goal}
              sessions={sessionsCompletedThisWeek}
              onDateRangeChange={onDateRangeChange}
            />
            <MediumText vertical={Spacing.large} bottom={Spacing.extraSmall}>
              Activities
            </MediumText>
            {activities.map((activity) => (
              <ActivityItem
                key={activity.key}
                activity={activity}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                mode={dateRange.mode}
                navigation={navigation}
              />
            ))}
          </If>
        </Content>
      </Screen>
    )
  }
)