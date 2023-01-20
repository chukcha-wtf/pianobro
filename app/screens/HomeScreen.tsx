import React, { FC, useRef } from "react"

import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabScreenProps } from "@navigators/MainNavigator"
import { HugeTitle, LabelText, LargeTitle, RegularText, SmallTitle } from "@common-ui/components/Text"
import { translate } from "@i18n/translate"
import { Spacing } from "@common-ui/constants/spacing"
import { SolidButton } from "@common-ui/components/Button"
import { observer } from "mobx-react-lite"
import { useStores } from "@models/index"
import Card from "@common-ui/components/Card"
import { formatDate, formatDateTime } from "@utils/formatDate"
import { If } from "@common-ui/components/Conditional"
import { useInterval } from "@utils/useInterval"
import { Cell, Row } from "@common-ui/components/Common"
import { EndPracticeModal, EndPracticeModalHandle } from "@components/EndPraticeModal"
import { ActivityEnum } from "@models/PracticeSession"

const ActiveSession = observer(
  function ActiveSession(_props) {
    const { practiceSessionStore } = useStores()

    useInterval(
      () => {
        practiceSessionStore.updateDuration()
      },
      practiceSessionStore.isPracticing ? 1000 : null
    )


    return (
      <Card bottom={Spacing.medium} key={practiceSessionStore.activeSession.uuid}>
        <LargeTitle>
          {practiceSessionStore.activeSession?.formattedDuration.hours}:{practiceSessionStore.activeSession?.formattedDuration.minutes}
          <SmallTitle> {practiceSessionStore.activeSession?.formattedDuration.seconds}</SmallTitle>
        </LargeTitle>
        <RegularText>
          {formatDateTime(practiceSessionStore.activeSession?.startTime)}
        </RegularText>
      </Card>
    )
  }
)

export const HomeScreen: FC<MainTabScreenProps<"Home">> = observer(
  function HomeScreen(_props) {
    const { practiceSessionStore } = useStores()

    const editPracticeModalRef = useRef<EndPracticeModalHandle>(null)

    const handleStartStop = () => {
      if (practiceSessionStore.isPracticing) {
        // Pause the current session and show the modal
        editPracticeModalRef.current?.open()
        return
      }
      
      // Start a new session
      practiceSessionStore.start()
    }
    
    const buttonTitle = practiceSessionStore.isPracticing ? translate("homeScreen.mainButtonTextActive") : translate("homeScreen.mainButtonTextInactive")
    const buttonIcon = practiceSessionStore.isPracticing ? "pause" : "play"
    
    return (
      <Screen>
        <Row top={Spacing.large}>
          <Cell>
            <HugeTitle left={Spacing.small} top={Spacing.large} text={translate("homeScreen.title")} />
          </Cell>
        </Row>
        <Cell left={Spacing.medium} right={Spacing.medium} top={Spacing.large} bottom={Spacing.large} >
          <SolidButton large type="primary" title={buttonTitle} onPress={handleStartStop} rightIcon={buttonIcon} rightIconSize={Spacing.large} />
        </Cell>
        <Content scrollable>
          <If condition={!!practiceSessionStore.activeSession}>
            <ActiveSession />
          </If>

          {practiceSessionStore.sessionsCompletedToday.map((practiceSession) => {
            return (
              <Card bottom={Spacing.medium} key={practiceSession.uuid}>
                <LargeTitle>
                  {practiceSession?.formattedDuration.hours}:{practiceSession?.formattedDuration.minutes}
                  <RegularText>
                    {" "}{formatDate(practiceSession.startTime, "dd MMM")}
                  </RegularText>
                </LargeTitle>
                <Row top={Spacing.extraSmall}>
                  {practiceSession?.activities.map((activity) => {
                    return (
                      <LabelText left={Spacing.tiny} key={activity} text={ActivityEnum[activity]} />
                    )
                  })}
                </Row>
              </Card>
            )
          })}
        </Content>
        <If condition={!!practiceSessionStore.activeSession}>
          <EndPracticeModal ref={editPracticeModalRef} />
        </If>
      </Screen>
    )
  }
)
