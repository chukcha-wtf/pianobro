import React, { ErrorInfo } from "react"
import { ScrollView, View, ViewStyle } from "react-native"

import { SolidButton } from "@common-ui/components/Button"
import { LargeTitle, MediumText, RegularText, SmallText } from "@common-ui/components/Text"
import { translate } from "../../i18n/translate"

import { Content, Screen } from "@common-ui/components/Screen"
import { Colors } from "@common-ui/constants/colors"
import { Spacing } from "@common-ui/constants/spacing"

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo
  onReset(): void
}

export function ErrorDetails(props: ErrorDetailsProps) {
  return (
    <Screen>
      <Content>
        <View style={$topSection}>
          <LargeTitle text={translate("errorScreen.title")} />
          <MediumText text={translate("errorScreen.friendlySubtitle")} />
        </View>

        <ScrollView style={$errorSection} contentContainerStyle={$errorSectionContentContainer}>
          <RegularText text={`${props.error}`.trim()} />
          <SmallText text={`${props.errorInfo.componentStack}`.trim()} />
        </ScrollView>

        <SolidButton onPress={props.onReset} title={translate("errorScreen.reset")} />
      </Content>
    </Screen>
  )
}

const $topSection: ViewStyle = {
  flex: 1,
  alignItems: "center",
}

const $errorSection: ViewStyle = {
  flex: 2,
  backgroundColor: Colors.separator,
  marginVertical: Spacing.medium,
  borderRadius: 6,
}

const $errorSectionContentContainer: ViewStyle = {
  padding: Spacing.medium,
}
