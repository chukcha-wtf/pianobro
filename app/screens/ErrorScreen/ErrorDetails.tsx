import React, { ErrorInfo } from "react"
import { ScrollView, View, ViewStyle } from "react-native"

import { SolidButton } from "@common-ui/components/Button"
import { HugeTitle, LargeTitle, MediumText, RegularText, SmallText } from "@common-ui/components/Text"
import { translate } from "../../i18n/translate"

import { Content, Screen } from "@common-ui/components/Screen"
import { Spacing } from "@common-ui/constants/spacing"
import { Cell } from "@common-ui/components/Common"

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo
  onReset(): void
}

export function ErrorDetails(props: ErrorDetailsProps) {
  return (
    <Screen>
      <HugeTitle text={translate("errorScreen.header")} left={Spacing.medium} />
      <Content>
        <Cell flex align="center">
          <LargeTitle bottom={Spacing.medium} text={translate("errorScreen.title")} />
          <MediumText align="center" text={translate("errorScreen.friendlySubtitle")} />
        </Cell>

        <SolidButton large onPress={props.onReset} title={translate("errorScreen.reset")} />
      </Content>
    </Screen>
  )
}
