import React, { FC, useCallback, useMemo } from "react"
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, SectionList, ViewStyle, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { observer } from "mobx-react-lite"
import { NavigationProp } from "@react-navigation/native"
import { translate } from "@i18n/translate"

import { Screen } from "@common-ui/components/Screen"

import { MainTabParamList, MainTabScreenProps } from "../navigators/MainNavigator"
import { ROUTES } from "@navigators/AppNavigator"
import { HugeTitle, LabelText, LargeTitle, MediumText, MediumTitle } from "@common-ui/components/Text"
import { Spacing } from "@common-ui/constants/spacing"
import { If } from "@common-ui/components/Conditional"
import { Card } from "@common-ui/components/Card"
import { Cell, Row } from "@common-ui/components/Common"
import { AggregatedActivity } from "@models/PracticeSessionStore"
import { ChartControl, ChartMode, getChartEndDate, getChartStartDate } from "@components/ChartControl"
import { Colors, Palette } from "@common-ui/constants/colors"
import { PracticeSession } from "@models/PracticeSession"
import { PracticeItem } from "@components/PracticeItem"
import { FLASH_LIST_OFFSET } from "./ActivityDetailsScreen"
import Icon from "@common-ui/components/Icon"

import { useStores } from "@models/index"
import { formatDateRangeText } from "@utils/formatDateRangeText"
import { useBottomPadding } from "@common-ui/utils/useBottomPadding"

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

const RANDOM_BG_COLORS = [
  Palette.blue100,
  Palette.green100,
  Palette.red100,
  Palette.yellow100,
  Palette.pink100,
]

const SECTION_TITLES = {
  activities: "Activities",
  sessions: "Practice Sessions",
}

const { width, height } = Dimensions.get("screen")

function ActivityItem({ activity, startDate, endDate, mode, navigation }: ActivityItemProps) {
  const openActivityScreen = () => {
    navigation.navigate(ROUTES.ActivityDetails, {
      activityId: activity.uuid,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      mode,
    })
  }

  const randomBgColor = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * RANDOM_BG_COLORS.length)
    return RANDOM_BG_COLORS[randomIndex]
  }, [])

  return (
    <Card backgroundColor={randomBgColor} nonElevated bottom={Spacing.large}>
      <TouchableOpacity onPress={openActivityScreen}>
        <Row align="space-between">
          <Row flex right={Spacing.medium} align="space-between">
            <Cell>
              <MediumTitle bottom={Spacing.tiny}>
                {activity.humanTitle}
              </MediumTitle>
              <LabelText color={Colors.dark}>{activity.sessionsCount} Sessions</LabelText>
            </Cell>
            <LargeTitle align="center">
              {activity.duration.hours}h {activity.duration.minutes}m
            </LargeTitle>
          </Row>
          <Icon
            name="chevron-right"
            size={Spacing.large} />
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
        <MediumText vertical={Spacing.medium}>
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

const HEADER_EXPANDED_HEIGHT = 52
const HEADER_COLLAPSED_HEIGHT = 44

export const StatisticsScreen: FC<MainTabScreenProps<"Statistics">> = observer(
  function StatisticsScreen(props) {
    const { navigation } = props
    const { practiceSessionStore } = useStores()
    const bottomPadding = useBottomPadding()
    
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


    const scrollY = useSharedValue(0)
    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset } = event.nativeEvent
      const { y } = contentOffset
      
      scrollY.value = y
    }, [])

    const dayTitle = useMemo(() => {
      return formatDateRangeText(dateRange.startDate, dateRange.endDate, dateRange.mode)
    }, [dateRange.startDate, dateRange.endDate, dateRange.mode])

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

    const $largeTitleHeaderStyle = useAnimatedStyle(() => {
      return {
        position: "absolute",
        top: 0,
        left: 0,
        width,
        paddingLeft: Spacing.medium,
        paddingTop: Spacing.medium,
        opacity: interpolate(scrollY.value, [0, HEADER_EXPANDED_HEIGHT + Spacing.medium], [1, 0], Extrapolate.CLAMP),
        height: interpolate(scrollY.value, [0, HEADER_EXPANDED_HEIGHT], [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT], Extrapolate.CLAMP),
      }
    })

    const $smallTitleHeaderStyle = useAnimatedStyle(() => {
      return {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width,
        alignItems: "center",
        justifyContent: "center",
        opacity: interpolate(scrollY.value, [0, HEADER_EXPANDED_HEIGHT + Spacing.medium], [0, 1], Extrapolate.CLAMP),
        height: interpolate(scrollY.value, [HEADER_EXPANDED_HEIGHT, 0], [HEADER_COLLAPSED_HEIGHT, HEADER_EXPANDED_HEIGHT], Extrapolate.CLAMP),
      }
    })

    const $scrollViewContent = {
      paddingTop: HEADER_EXPANDED_HEIGHT,
      paddingBottom: bottomPadding
    }

    return (
      <Screen bgColor={Colors.grayBackground}>
        <Cell
          flex
          bgColor={Colors.grayBackground}
          innerLeft={Spacing.medium}
          innerRight={Spacing.medium - FLASH_LIST_OFFSET}
        >
          <SectionList
            contentContainerStyle={$scrollViewContent}
            sections={DATA}
            onScroll={onScroll}
            scrollEventThrottle={16}
            scrollEnabled={!!DATA.length}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.uuid}_${index}`}
            renderItem={({ section, item }) =>
              renderSectionItem({ item, section, navigation, startDate: dateRange.startDate, endDate: dateRange.endDate, mode: dateRange.mode })
            }
            renderSectionHeader={renderSectionHeader}
            ListHeaderComponent={
              <If condition={practiceSessionStore.hasCompletedSessions}>
                <StatisticsHeader
                  sessionsCompleted={sessionsCompleted}
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  mode={dateRange.mode}
                  onDateRangeChange={onDateRangeChange}
                />
              </If>
            }
            ListEmptyComponent={() => {
              return (
                <Cell top={height / 3} align="center" justify="center">
                  <MediumTitle align="center" muted>
                    Your progress will appear {"\n"} once you log a practice session.
                  </MediumTitle>
                </Cell>
              )
            }}
          />
          <View style={$solidBackgroundStyle} />
          <Animated.View style={$largeTitleHeaderStyle}>
            <HugeTitle text={translate("statisticsScreen.title")} />
          </Animated.View>
          <Animated.View style={$smallTitleHeaderStyle}>
            <MediumText>{dayTitle}</MediumText>
          </Animated.View>
        </Cell>
      </Screen>
    )
  }
)

const $solidBackgroundStyle: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  width,
  height: HEADER_COLLAPSED_HEIGHT,
  backgroundColor: Colors.grayBackground,
}
