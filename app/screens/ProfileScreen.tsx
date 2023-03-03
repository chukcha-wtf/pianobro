import React, { FC, useRef } from "react"
import { ViewStyle } from "react-native"
import { Switch, TouchableOpacity } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import * as Application from "expo-application"
import { observer } from "mobx-react-lite"
import { translate } from "@i18n/translate"

import { HugeTitle, LabelText, LargeTitle, MediumText, RegularText, SmallText } from "@common-ui/components/Text"
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
import { ReminderDate, ReminderStore, getReminderDates } from "@models/Reminder"
import { populateDevData } from "@utils/populateDevData"
import { TimePickerModal, TimePickerModalHandle } from "@components/TimePickerModal"
import Icon from "@common-ui/components/Icon"
import { prettifyTime } from "@utils/prettifyTime"
import { useAlert } from "@common-ui/contexts/AlertContext"
import { isPushNotificationsEnabledAsync } from "@services/pushNotifications"
import { openAppSettings } from "@utils/openLinkInBrowser"
import { TxKeyPath } from "@i18n/i18n"

function DateCell({ date, scheduledTime, onPress }: { date: string; scheduledTime: string; onPress: (date: string) => void }) {
  const isSelected = !!scheduledTime
  const text = translate(`profileScreen.dates.${date}` as TxKeyPath).slice(0, 1).toUpperCase()

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
    const { showAlert } = useAlert()
    
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

    const handleValueChange = async () => {
      if (!remindersStore.isEnabled) {
        const permissionGranted = await isPushNotificationsEnabledAsync()

        if (!permissionGranted) {
          showAlert(
            translate("profileScreen.alertTitle"),
            translate("profileScreen.alertMessage"),
            [
              {
                text: translate("profileScreen.alertButton"),
                onPress: () => openAppSettings(),
              },
            ]
          )

          return
        }
      }

      remindersStore.toggleEnabled()  
    }

    const REMINDER_DATES = getReminderDates()

    return (
      <>
        <Row top={Spacing.large} bottom={Spacing.tiny} align="space-between">
          <MediumText>
            {translate("profileScreen.practiceReminders")}
          </MediumText>
          <Switch
            trackColor={{ false: "#F8F4FF", true: "#F9D262" }}
            value={remindersStore.isEnabled}
            onValueChange={handleValueChange}
          />
        </Row>
        <SmallText bottom={Spacing.medium} muted>
        {translate("profileScreen.practiceRemindersDescription")}
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
          <MediumText>
            {translate("profileScreen.practiceGoal")}
          </MediumText>
          <TouchableOpacity onPress={handlePress}>
            <Row>
              <Icon name="clock" right={Spacing.small} />
              <LargeTitle>{prettifyTime(goalHours)} : {prettifyTime(goalMinutes)}</LargeTitle>
            </Row>
          </TouchableOpacity>
        </Row>
        <SmallText bottom={Spacing.medium} muted>
          {translate("profileScreen.practiceGoalDescription")}
        </SmallText>
        {/* Modal shown when manually logging practice */}
        <TimePickerModal
          noAmPm
          title={translate("profileScreen.practiceGoalPickerTitle")}
          hours={goalHours || 1}
          minutes={goalMinutes || 0}
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
    const { top } = useSafeAreaInsets()
    
    const { remindersStore, settingsStore, statisticsStore } = store
    const { totalPracticeTime, hasCompletedSessions } = statisticsStore

    const handleButton = () => populateDevData(store, 2500)

    return (
      <Screen bgColor={Colors.grayBackground} edges={["left", "right"]}>
        <Content bgColor={Colors.grayBackground}>
          <HugeTitle
            top={top}
            bottom={Spacing.medium}
            text={translate("profileScreen.title")}
          />
          <If condition={!!hasCompletedSessions}>
            <Card>
              <LargeTitle align="center" bottom={Spacing.medium}>
                {translate("profileScreen.totalProgress")}
              </LargeTitle>
              <HugeTitle align="center" color={Colors.primary}>
                {totalPracticeTime.hours}{translate("common.hr")} {totalPracticeTime.minutes}{translate("common.min")}
              </HugeTitle>
              <If condition={!!settingsStore.installDate}>
                <LabelText align="center" top={Spacing.small}>{translate("profileScreen.since")} {settingsStore.startDate}</LabelText>
              </If>
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
              <MediumText muted>{translate("profileScreen.appVersion")}: </MediumText>
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
  backgroundColor: Colors.midGrey,
}

const $selectedDateCell: ViewStyle = {
  borderWidth: 2,
  borderColor: Colors.dark,
  backgroundColor: Colors.warning,
}
