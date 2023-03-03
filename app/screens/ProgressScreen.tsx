import React, { FC, useCallback, useMemo } from "react"
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, FlatList, ViewStyle, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
import { observer } from "mobx-react-lite"
import { NavigationProp } from "@react-navigation/native"
import { translate } from "@i18n/translate"

import { Screen } from "@common-ui/components/Screen"

import { MainTabParamList, MainTabScreenProps } from "../navigators/MainNavigator"
import { ROUTES } from "@navigators/AppNavigator"
import { HugeTitle, LabelText, LargeTitle, MediumText, MediumTitle, RegularText } from "@common-ui/components/Text"
import { Spacing } from "@common-ui/constants/spacing"
import { If, Ternary } from "@common-ui/components/Conditional"
import { Card } from "@common-ui/components/Card"
import { Cell, Row } from "@common-ui/components/Common"
import { AggregatedActivity } from "@models/Statistics"
import { ChartControl, ChartMode, getChartEndDate, getChartStartDate } from "@components/ChartControl"
import { Colors, Palette } from "@common-ui/constants/colors"
import { PracticeSession } from "@models/PracticeSession"
import { PracticeItem } from "@components/PracticeItem"
import { FLASH_LIST_OFFSET } from "./ActivityDetailsScreen"
import Icon from "@common-ui/components/Icon"

import { useStores } from "@models/index"
import { formatDateRangeText } from "@utils/formatDateRangeText"
import { useBottomPadding } from "@common-ui/utils/useBottomPadding"
import { formatDuration } from "@utils/formatDate"
import { TxKeyPath } from "@i18n/i18n"

type ActivityItemProps = {
  activity: AggregatedActivity
  navigation: NavigationProp<MainTabParamList>
  startDate: Date
  endDate: Date
  mode: keyof typeof ChartMode
}

type StatisticsHeaderProps = {
  daysPracticed: Map<string, number>;
  activities: AggregatedActivity[];
  navigation: NavigationProp<MainTabParamList>
  totalPracticeTime: number;
  startDate: Date;
  endDate: Date;
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

  const duration = formatDuration(activity.duration)
  const sessionsCount = activity.sessionUuids.length

  return (
    <Card backgroundColor={randomBgColor} nonElevated bottom={Spacing.large}>
      <TouchableOpacity onPress={openActivityScreen}>
        <Row align="space-between">
          <Row flex right={Spacing.medium} align="space-between">
            <Cell>
              <MediumTitle bottom={Spacing.tiny}>
                {translate(`activity.${activity.key}` as TxKeyPath, { defaultValue: activity.name })}
              </MediumTitle>
              <LabelText color={Colors.dark}>{sessionsCount} {translate("progressScreen.sessions", { count: sessionsCount })}</LabelText>
            </Cell>
            <LargeTitle align="center">
              {duration.hours}{translate("common.h")} {duration.minutes}{translate("common.m")}
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
    const {
      daysPracticed,
      activities,
      navigation,
      totalPracticeTime,
      startDate,
      endDate,
      mode,
      onDateRangeChange
    } = props
    const { remindersStore } = useStores()

    const totalPracticeTimeFormatted = formatDuration(totalPracticeTime)

    const title = useMemo(() => {
      return formatDateRangeText(startDate, endDate, mode)
    }, [startDate, endDate, mode])

    const totalDaysPracticed = daysPracticed.size
    
    const totalPracticeTimeText = totalPracticeTimeFormatted.hours?.length > 2 ?
      `${totalPracticeTimeFormatted.hours} ${translate("common.hr")}` :
      `${totalPracticeTimeFormatted.hours}${translate("common.hr")} ${totalPracticeTimeFormatted.minutes}${translate("common.min")}`

    return (
      <Cell right={FLASH_LIST_OFFSET} bottom={Spacing.larger}>
        <MediumText vertical={Spacing.medium}>
          {title}
        </MediumText>
        <Row align="space-between">
          <Card flex>
            <MediumText align="center" bottom={Spacing.small}>
              {translate("progressScreen.time")}
            </MediumText>
            <LargeTitle color={Colors.primary} align="center">
              {totalPracticeTimeText}
            </LargeTitle>
          </Card>
          <Card flex left={Spacing.medium}>
            <MediumText align="center" bottom={Spacing.small}>
              {translate("progressScreen.days")}
            </MediumText>
            <LargeTitle align="center">
              {totalDaysPracticed}
            </LargeTitle>
          </Card>
        </Row>
        <ChartControl
          startDate={startDate}
          endDate={endDate}
          mode={mode}
          daysPracticed={daysPracticed}
          practiceGoal={remindersStore.goal}
          onDateRangeChange={onDateRangeChange}
        />
        <If condition={activities.length > 0}>
          <MediumText top={Spacing.large} bottom={Spacing.large}>
            {translate("progressScreen.activities")}
          </MediumText>
        </If>
        {activities.map((activity) => (
          <Cell key={activity.uuid} right={FLASH_LIST_OFFSET}>
            <ActivityItem
              activity={activity}
              navigation={navigation}
              startDate={startDate}
              endDate={endDate}
              mode={mode}
            />
          </Cell>
        ))}
        <Ternary condition={!!totalDaysPracticed}>
          <MediumText>
            {translate("progressScreen.practiceSessions")}
          </MediumText>
          <RegularText top={Spacing.larger} align="center" muted>
            {translate("progressScreen.noPracticeSessions")}
          </RegularText>
        </Ternary>
      </Cell>
    )
  }
)

const renderListItem = ({ item }: { item: PracticeSession }) => {
  return (
    <Cell right={FLASH_LIST_OFFSET}>
      <PracticeItem item={item} />
    </Cell>
  )
}

const HEADER_EXPANDED_HEIGHT = 52
const HEADER_COLLAPSED_HEIGHT = 44

export const ProgressScreen: FC<MainTabScreenProps<"Progress">> = observer(
  function ProgressScreen(props) {
    const { navigation } = props
    const { practiceSessionStore, statisticsStore } = useStores()
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

    const onDateRangeChange = (startDate: Date, endDate: Date, mode: keyof typeof ChartMode) => {
      setDateRange({
        startDate,
        endDate,
        mode,
      })
    }

    const {
      sessionUuids: completedSessionUuids,
      activities,
      daysPracticed,
      totalPracticeTime,
    } = statisticsStore.getRecordsBetween(dateRange.startDate, dateRange.endDate)
    
    const sessionsCompleted = practiceSessionStore.getSessionsFromUuids(completedSessionUuids)

    const dayTitle = useMemo(() => {
      return formatDateRangeText(dateRange.startDate, dateRange.endDate, dateRange.mode)
    }, [dateRange.startDate, dateRange.endDate, dateRange.mode])

    const scrollY = useSharedValue(0)
    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset } = event.nativeEvent
      const { y } = contentOffset
      
      scrollY.value = y
    }, [])

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
          <FlatList
            contentContainerStyle={$scrollViewContent}
            data={sessionsCompleted}
            onScroll={onScroll}
            scrollEventThrottle={16}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            scrollEnabled={statisticsStore.hasCompletedSessions}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.uuid}_${index}`}
            renderItem={renderListItem}
            ListHeaderComponent={
              <If condition={statisticsStore.hasCompletedSessions}>
                <StatisticsHeader
                  daysPracticed={daysPracticed}
                  activities={activities}
                  navigation={navigation}
                  totalPracticeTime={totalPracticeTime}
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  mode={dateRange.mode}
                  onDateRangeChange={onDateRangeChange}
                />
              </If>
            }
            ListEmptyComponent={() => {
              return (
                <If condition={!statisticsStore.hasCompletedSessions}>
                  <Cell top={height / 3} align="center" justify="center">
                    <MediumTitle align="center" muted>
                      {translate("progressScreen.noProgress")}
                    </MediumTitle>
                  </Cell>
                </If>
              )
            }}
          />
          <View style={$solidBackgroundStyle} />
          <Animated.View style={$largeTitleHeaderStyle}>
            <HugeTitle text={translate("progressScreen.title")} />
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
