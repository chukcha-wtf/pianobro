import React, { FC, useRef } from "react"
import { ViewStyle } from "react-native"
import { Switch, TouchableOpacity } from "react-native-gesture-handler"

import * as Application from "expo-application"
import { observer } from "mobx-react-lite"
import { translate } from "@i18n/translate"

import { HugeTitle, LargeTitle, MediumText, RegularText, SmallText } from "@common-ui/components/Text"
import { BottomContainer, Row } from "@common-ui/components/Common"
import { Spacing } from "@common-ui/constants/spacing"
import { LinkButton } from "@common-ui/components/Button"
import { Content, Screen } from "@common-ui/components/Screen"
import { MainTabScreenProps } from "../navigators/MainNavigator"
import { If } from "@common-ui/components/Conditional"
import { Card } from "@common-ui/components/Card"
import { useBottomPadding } from "@common-ui/utils/useBottomPadding"
import { Colors } from "@common-ui/constants/colors"

import { useStores } from "@models/index"
import { ReminderDate, ReminderStore, REMINDER_DATES } from "@models/Reminder"
import { populateDevData } from "@utils/populateDevData"
import { TimePickerModal, TimePickerModalHandle } from "@components/TimePickerModal"
import Icon from "@common-ui/components/Icon"
import { prettifyTime } from "@utils/prettifyTime"

function DateCell({ date, scheduledTime, onPress }: { date: string; scheduledTime: string; onPress: (date: string) => void }) {
  const isSelected = !!scheduledTime
  const text = date.slice(0, 1).toUpperCase()

  const $style: ViewStyle[] = [$dateCell]

  if (isSelected) {
    $style.push($selectedDateCell)
  }

  const handlePress = () => {
    onPress(date)
  }

  return (
    <TouchableOpacity onPress={handlePress} style={[$dateCell, isSelected && $selectedDateCell]}>
      <MediumText>{text}</MediumText>
    </TouchableOpacity>
  )
}

const NotificationRemindersScheduler = observer(
  function NotificationRemindersScheduler({ remindersStore }: { remindersStore: ReminderStore }) {
    const timePickerModalRef = useRef<TimePickerModalHandle>(null)

    const activeDate = useRef<ReminderDate | null>(null)

    const onDatePress = (date: ReminderDate) => {
      if (!remindersStore.isEnabled) return

      if (!remindersStore.isDateScheduled(date)) {
        activeDate.current = date
        timePickerModalRef.current?.open()
        return
      }

      remindersStore.removeDateReminder(date)
    }

    const handleSave = (hours: number, minutes: number) => {
      remindersStore.setDateReminder(activeDate.current, `${hours}:${minutes}`)
    }

    return (
      <>
        <Row top={Spacing.large} bottom={Spacing.tiny} align="space-between">
          <MediumText>Practice Reminders</MediumText>
          <Switch
            value={remindersStore.isEnabled}
            onValueChange={remindersStore.toggleEnabled}
          />
        </Row>
        <SmallText bottom={Spacing.medium} muted>
          Set up reminders for your practice.{"\n"}Staying consistent can help you improve results!
        </SmallText>
        <Row bottom={Spacing.large} align="space-between">
          {REMINDER_DATES.map((date) => {
            const scheduledTime = remindersStore.getScheduleTime(date)
            
            return (
              <DateCell
                key={date}
                date={date}
                onPress={onDatePress}
                scheduledTime={scheduledTime}
              />
            )
          })}
        </Row>
        {/* Modal shown when manually logging practice */}
        <TimePickerModal ref={timePickerModalRef} onSave={handleSave} />
      </>
    )
  }
)

const PracticeGoalSetting = observer(
  function PracticeGoalSetting({ remindersStore }: { remindersStore: ReminderStore }) {
    const timePickerModalRef = useRef<TimePickerModalHandle>(null)

    const handlePress = () => {
      timePickerModalRef.current?.open()
    }

    const handleSave = (hours: number, minutes: number) => {
      const goalTimeInMinutes = hours * 60 + minutes

      remindersStore.setGoalTime(goalTimeInMinutes)
    }

    const goalHours = Math.floor(remindersStore.goal / 60)
    const goalMinutes = remindersStore.goal % 60

    return (
      <>
        <Row top={Spacing.large} bottom={Spacing.tiny} align="space-between">
          <MediumText>Practice Goal</MediumText>
          <TouchableOpacity onPress={handlePress}>
            <Row>
              <Icon name="clock" right={Spacing.small} />
              <LargeTitle>{prettifyTime(goalHours)} : {prettifyTime(goalMinutes)}</LargeTitle>
            </Row>
          </TouchableOpacity>
        </Row>
        {/* Modal shown when manually logging practice */}
        <TimePickerModal
          title="Set Practice Goal"
          hours={goalHours}
          minutes={goalMinutes}
          ref={timePickerModalRef}
          onSave={handleSave}
        />
      </>
    )
  }
)

export const ProfileScreen: FC<MainTabScreenProps<"Profile">> = observer(
  function ProfileScreen() {
    const store = useStores()
    const bottomPadding = useBottomPadding()
    
    const { practiceSessionStore, remindersStore } = store
    const { totalPracticeTime, hasCompletedSessions } = practiceSessionStore

    const handleButton = () => populateDevData(store, 100)

    return (
      <Screen>
        <HugeTitle left={Spacing.medium} top={Spacing.large} text={translate("profileScreen.title")} />
        <Content>
          <If condition={!!hasCompletedSessions}>
            <Card>
              <LargeTitle align="center" bottom={Spacing.medium}>
                Total Practice Time
              </LargeTitle>
              <HugeTitle align="center">
                {totalPracticeTime.hours}hr {totalPracticeTime.minutes}min
              </HugeTitle>
            </Card>
          </If>

          <NotificationRemindersScheduler remindersStore={remindersStore} />

          <PracticeGoalSetting remindersStore={remindersStore} />

          <If condition={__DEV__}>
            <LinkButton
              top={Spacing.extraLarge}
              type="primary"
              title="Populate Dev Data"
              onPress={handleButton}
            />
          </If>

          <BottomContainer bottom={bottomPadding + Spacing.large}>
            <Row flex align="center" top={Spacing.small}>
              <MediumText muted>App Version: </MediumText>
              <RegularText muted>{Application.nativeApplicationVersion}</RegularText>
            </Row>
          </BottomContainer>
        </Content>
      </Screen>
    )
  }
)


const $dateCell: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  paddingTop: Spacing.micro,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: Colors.lightGrey,
}

const $selectedDateCell: ViewStyle = {
  borderWidth: 2,
  borderColor: Colors.dark,
  backgroundColor: Colors.warning,
}
