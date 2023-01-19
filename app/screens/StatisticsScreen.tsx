import React, { FC } from "react"

import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabScreenProps } from "../navigators/MainNavigator"
import { HugeTitle } from "@common-ui/components/Text"
import { translate } from "@i18n/translate"
import { Spacing } from "@common-ui/constants/spacing"

export const StatisticsScreen: FC<MainTabScreenProps<"Statistics">> = function StatisticsScreen() {
  return (
    <Screen>
      <HugeTitle left={Spacing.small} top={Spacing.large} text={translate("statisticsScreen.title")} />
      <Content>
      </Content>
    </Screen>
  )
}
