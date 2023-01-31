import React, { FC } from "react"

import * as Application from "expo-application"
import { translate } from "@i18n/translate"

import { HugeTitle, LargeTitle, MediumText, RegularText } from "@common-ui/components/Text"
import { BottomContainer, Row } from "@common-ui/components/Common"
import { Spacing } from "@common-ui/constants/spacing"
import { LinkButton } from "@common-ui/components/Button"
import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabScreenProps } from "../navigators/MainNavigator"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { observer } from "mobx-react-lite"
import { useStores } from "@models/index"
import { If } from "@common-ui/components/Conditional"
import { Card } from "@common-ui/components/Card"
import { useBottomPadding } from "@common-ui/utils/useBottomPadding"
import { Switch, TouchableOpacity } from "react-native-gesture-handler"
import { REMINDER_DATES } from "@models/Reminder"
import { Colors } from "@common-ui/constants/colors"
import { ViewStyle } from "react-native"

const $dateCell: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  paddingTop: Spacing.micro,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: Colors.white,
  borderWidth: 2,
  borderColor: Colors.dark,
}

const $selectedDateCell: ViewStyle = {
  backgroundColor: Colors.warning,
}

export const ProfileScreen: FC<MainTabScreenProps<"Profile">> = observer(
  function ProfileScreen() {
    const { practiceSessionStore, remindersStore } = useStores()
    const bottomPadding = useBottomPadding()

    const handleButton = () => {
    }

    console.log("scheduled", remindersStore.scheduledNotifications)

    return (
      <Screen>
        <HugeTitle left={Spacing.medium} top={Spacing.large} text={translate("profileScreen.title")} />
        <Content>
          <If condition={!!practiceSessionStore.hasCompletedSessions}>
            <Card>
              <LargeTitle align="center" bottom={Spacing.medium}>
                Total Practice Time
              </LargeTitle>
              <HugeTitle align="center">
                {practiceSessionStore.totalPracticeTime.hours} {practiceSessionStore.totalPracticeTime.minutes}
              </HugeTitle>
            </Card>
          </If>
          <Row vertical={Spacing.large} align="space-between">
            <MediumText>Enable Reminders</MediumText>
            <Switch
              value={remindersStore.isEnabled}
              onValueChange={remindersStore.toggleEnabled}
            />
          </Row>
          <Row vertical={Spacing.large} align="space-between">
            {REMINDER_DATES.map((date) => {
              const text = date.slice(0, 1).toUpperCase()
              const isSelected = remindersStore.scheduledNotifications.has(date)

              const $style: ViewStyle[] = [$dateCell]

              if (isSelected) {
                $style.push($selectedDateCell)
              }

              const onPress = () => {
                remindersStore.toggleDate(date)
              }

              return (
                <TouchableOpacity onPress={onPress} style={$style} key={date}>
                  <MediumText muted>{text}</MediumText>
                </TouchableOpacity>
              )
            })}
          </Row>
          <LinkButton top={Spacing.extraLarge} type="primary" title={translate("profileScreen.reportBugs")} onPress={handleButton} />

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
