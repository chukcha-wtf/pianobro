import React, { FC, useCallback, useMemo } from "react"
import { observer } from "mobx-react-lite"

import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabParamList, MainTabScreenProps } from "../navigators/MainNavigator"
import { ROUTES } from "@navigators/AppNavigator"
import { HugeTitle, LabelText, LargeTitle, MediumText, MediumTitle } from "@common-ui/components/Text"
import { translate } from "@i18n/translate"
import { Spacing } from "@common-ui/constants/spacing"
import { useStores } from "@models/index"
import { If } from "@common-ui/components/Conditional"
import { Card } from "@common-ui/components/Card"
import { Cell, Row } from "@common-ui/components/Common"
import { TouchableOpacity } from "react-native-gesture-handler"
import { NavigationProp } from "@react-navigation/native"
import { AggregatedActivity } from "@models/PracticeSessionStore"
import { ChartControl, ChartMode, getChartEndDate, getChartStartDate } from "@components/ChartControl"
import { Colors } from "@common-ui/constants/colors"
import { PracticeSession } from "@models/PracticeSession"
import { SectionList } from "react-native"
import { PracticeItem } from "@components/PracticeItem"
import { formatDateRangeText } from "@utils/formatDateRangeText"
import { FLASH_LIST_OFFSET } from "./ActivityDetailsScreen"

type ActivityItemProps = {
  activity: AggregatedActivity
  navigation: NavigationProp<MainTabParamList>
  startDate: Date
  endDate: Date
  mode: keyof typeof ChartMode
}

type StatisticsHeaderProps = {
  sessionsCompleted: PracticeSession[]
  startDate: Date
  endDate: Date,
  mode: keyof typeof ChartMode
  onDateRangeChange: (startDate: Date, endDate: Date, mode: keyof typeof ChartMode) => void;
}

const SECTION_TITLES = {
  activities: "Activities",
  sessions: "Practice Sessions",
}

function ActivityItem({ activity, startDate, endDate, mode, navigation }: ActivityItemProps) {
  const openActivityScreen = () => {
    navigation.navigate(ROUTES.ActivityDetails, {
      activityId: activity.uuid,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      mode,
    })
  }

  return (
    <Card nonElevated bottom={Spacing.large}>
      <TouchableOpacity onPress={openActivityScreen}>
        <Row align="space-between">
          <MediumTitle align="center">
            {activity.humanTitle}
          </MediumTitle>
          <LargeTitle align="center">
            {activity.duration.hours}h {activity.duration.minutes}m
          </LargeTitle>
        </Row>
      </TouchableOpacity>
    </Card>
  )
}

const StatisticsHeader = observer(
  function StatisticsHeader(props: StatisticsHeaderProps) {
    const { sessionsCompleted, startDate, endDate, mode, onDateRangeChange } = props
    const { practiceSessionStore, remindersStore } = useStores()

    const daysPracticed = useMemo(
      () => practiceSessionStore.getDaysWithCompletedSessions(sessionsCompleted),
      [sessionsCompleted]
    )
    const totalPracticeTime = useMemo(
      () => practiceSessionStore.getTotalPracticeTimeFromSessions(sessionsCompleted),
      [sessionsCompleted]
    )

    const title = useMemo(() => {
      return formatDateRangeText(startDate, endDate, mode)
    }, [startDate, endDate, mode])

    const totalPracticeTimeText = totalPracticeTime.hours?.length > 2 ?
      `${totalPracticeTime.hours} hr` :
      `${totalPracticeTime.hours}hr ${totalPracticeTime.minutes}min`

    return (
      <Cell right={FLASH_LIST_OFFSET} bottom={Spacing.larger}>
        <MediumText vertical={Spacing.large} bottom={Spacing.extraSmall}>
          {title}
        </MediumText>
        <Row align="space-between">
          <Card flex>
            <MediumTitle align="center" bottom={Spacing.small}>
              Time
            </MediumTitle>
            <LargeTitle color={Colors.primary} align="center">
              {totalPracticeTimeText}
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
          startDate={startDate}
          endDate={endDate}
          mode={mode}
          practiceGoal={remindersStore.goal}
          sessions={sessionsCompleted}
          onDateRangeChange={onDateRangeChange}
        />
      </Cell>
    )
  }
)

const renderSectionHeader = ({ section }) => {
  if (!section.data.length) {
    return null
  }

  return (
    <Cell bgColor={Colors.grayBackground} flex>
      <MediumText innerVertical={Spacing.extraSmall} bottom={Spacing.small}>
        {section.title}
      </MediumText>
    </Cell>
  )
}

const renderSectionItem = ({ item, section, navigation, startDate, endDate, mode }) => {
  if (section.title === SECTION_TITLES.activities) {
    return (
      <Cell right={FLASH_LIST_OFFSET}>
        <ActivityItem
          activity={item}
          navigation={navigation}
          startDate={startDate}
          endDate={endDate}
          mode={mode}
        />
      </Cell>
    )
  }

  if (section.title === SECTION_TITLES.sessions) {
    return (
      <Cell right={FLASH_LIST_OFFSET}>
        <PracticeItem item={item} key={item.uuid} />
      </Cell>
    )
  }

  return null
}

export const StatisticsScreen: FC<MainTabScreenProps<"Statistics">> = observer(
  function StatisticsScreen(props) {
    const { navigation } = props
    const { practiceSessionStore } = useStores()
    
    const [dateRange, setDateRange] = React.useState<{
      startDate: Date
      endDate: Date,
      mode: keyof typeof ChartMode
    }>({
      startDate: getChartStartDate(ChartMode.week, new Date()),
      endDate: getChartEndDate(ChartMode.week, new Date()),
      mode: ChartMode.week,
    })

    const onDateRangeChange = useCallback((startDate: Date, endDate: Date, mode: keyof typeof ChartMode) => {
      setDateRange({
        startDate,
        endDate,
        mode,
      })
    }, [])

    const sessionsCompleted = practiceSessionStore.getSessionsCompletedBetweenDates(dateRange.startDate, dateRange.endDate)

    const activities = useMemo(
      () => practiceSessionStore.getActivitiesFromSessions(sessionsCompleted),
      [sessionsCompleted]
    )

    const DATA: Array<{
      title: string
      data: Array<AggregatedActivity | PracticeSession>
    }> = [
      {
        title: SECTION_TITLES.activities,
        data: activities
      },
      {
        title: SECTION_TITLES.sessions,
        data: sessionsCompleted
      }
    ]

    return (
      <Screen bgColor={Colors.grayBackground}>
        <HugeTitle left={Spacing.medium} top={Spacing.large} text={translate("statisticsScreen.title")} />
        <Content
          bgColor={Colors.grayBackground}
          innerRight={Spacing.medium - FLASH_LIST_OFFSET}
        >
          <If condition={!practiceSessionStore.hasCompletedSessions}>
            <LargeTitle align="center">
              You have no completed practice sessions yet.
            </LargeTitle>
          </If>
          <If condition={practiceSessionStore.hasCompletedSessions}>
            <SectionList
              sections={DATA}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => `${item.uuid}_${index}`}
              renderItem={({ section, item }) =>
                renderSectionItem({ item, section, navigation, startDate: dateRange.startDate, endDate: dateRange.endDate, mode: dateRange.mode })
              }
              renderSectionHeader={renderSectionHeader}
              ListHeaderComponent={
                <StatisticsHeader
                  sessionsCompleted={sessionsCompleted}
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  mode={dateRange.mode}
                  onDateRangeChange={onDateRangeChange}
                />
              }
            />
          </If>
        </Content>
      </Screen>
    )
  }
)