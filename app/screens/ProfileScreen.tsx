import React, { FC } from "react"

import * as Application from "expo-application"
import { translate } from "@i18n/translate"

import { HugeTitle, MediumText, RegularText } from "@common-ui/components/Text"
import { Row } from "@common-ui/components/Common"
import { Spacing } from "@common-ui/constants/spacing"
import { LinkButton } from "@common-ui/components/Button"
import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabScreenProps } from "../navigators/MainNavigator"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"


export const ProfileScreen: FC<MainTabScreenProps<"Profile">> = function ProfileScreen() {
  return (
    <Screen>
      <HugeTitle left={Spacing.small} top={Spacing.large} text={translate("profileScreen.title")} />
      <Content scrollable>
        <Row top={Spacing.small}>
          <MediumText>App Build Version: </MediumText>
          <RegularText>{Application.nativeApplicationVersion}</RegularText>
        </Row>
        <LinkButton top={Spacing.extraLarge} type="primary" title={translate("profileScreen.reportBugs")} onPress={() => openLinkInBrowser("https://github.com/infinitered/ignite/issues")} />
      </Content>
    </Screen>
  )
}
