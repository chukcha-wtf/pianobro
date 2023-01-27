import React, { FC } from "react"

import * as Application from "expo-application"
import { translate } from "@i18n/translate"

import { HugeTitle, LargeTitle, MediumText, RegularText } from "@common-ui/components/Text"
import { Row } from "@common-ui/components/Common"
import { Spacing } from "@common-ui/constants/spacing"
import { LinkButton } from "@common-ui/components/Button"
import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabScreenProps } from "../navigators/MainNavigator"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { observer } from "mobx-react-lite"
import { useStores } from "@models/index"
import { If } from "@common-ui/components/Conditional"
import { Card } from "@common-ui/components/Card"


export const ProfileScreen: FC<MainTabScreenProps<"Profile">> = observer(
  function ProfileScreen() {
    const { practiceSessionStore } = useStores()

    return (
      <Screen>
        <HugeTitle left={Spacing.medium} top={Spacing.large} text={translate("profileScreen.title")} />
        <Content scrollable>
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
          <Row top={Spacing.small}>
            <MediumText>App Build Version: </MediumText>
            <RegularText>{Application.nativeApplicationVersion}</RegularText>
          </Row>
          <LinkButton top={Spacing.extraLarge} type="primary" title={translate("profileScreen.reportBugs")} onPress={() => openLinkInBrowser("https://github.com/infinitered/ignite/issues")} />
        </Content>
      </Screen>
    )
  }
)
