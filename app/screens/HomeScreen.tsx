import React, { FC, useMemo, useRef } from "react"
import { observer } from "mobx-react-lite"

import { MainTabScreenProps } from "@navigators/MainNavigator"
import { translate } from "@i18n/translate"
import { useStores } from "@models/index"
import { ActivityEnum } from "@models/PracticeSession"

import { Content, Screen } from "@common-ui/components/Screen"
import { HugeTitle, LabelText, LargeTitle, RegularText, SmallText, SmallTitle } from "@common-ui/components/Text"
import { IconButton, SolidButton } from "@common-ui/components/Button"
import { Card } from "@common-ui/components/Card"
import { If } from "@common-ui/components/Conditional"
import { Cell, Row } from "@common-ui/components/Common"
import { EndPracticeModal, EndPracticeModalHandle } from "@components/EndPraticeModal"

import { Spacing } from "@common-ui/constants/spacing"
import { useInterval } from "@utils/useInterval"
import { formatDate, formatDateTime } from "@utils/formatDate"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { AddPracticeModal, AddPracticeModalHandle } from "@components/AddPracticeModal"

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
      <Card type="info" bottom={Spacing.medium} innerVertical={Spacing.large}>
        <LargeTitle align="center" bottom={Spacing.medium}>
          Practice in Progress
        </LargeTitle>
        <HugeTitle align="center">
          {practiceSessionStore.activeSession?.formattedDuration.hours}:{practiceSessionStore.activeSession?.formattedDuration.minutes}
          <LargeTitle> {practiceSessionStore.activeSession?.formattedDuration.seconds}</LargeTitle>
        </HugeTitle>
      </Card>
    )
  }
)

export const HomeScreen: FC<MainTabScreenProps<"Home">> = observer(
  function HomeScreen(_props) {
    const { practiceSessionStore, quotesStore } = useStores()
    const bottomOffset = useBottomTabBarHeight()

    const editPracticeModalRef = useRef<EndPracticeModalHandle>(null)
    const addPracticeModalRef = useRef<AddPracticeModalHandle>(null)

    const quoteOfTheDay = useMemo(() => quotesStore.randomQuote, [])

    const handleStartStop = () => {
      if (practiceSessionStore.isPracticing) {
        editPracticeModalRef.current?.open()
        return
      }
      
      // Start a new session
      practiceSessionStore.start()
    }

    const addSession = () => {
      addPracticeModalRef.current?.open()
    }
    
    const buttonTitle = practiceSessionStore.isPracticing ? translate("homeScreen.mainButtonTextActive") : translate("homeScreen.mainButtonTextInactive")
    const buttonIcon = practiceSessionStore.isPracticing ? "pause" : "play"
    
    return (
      <Screen>
        <Row horizontal={Spacing.medium} top={Spacing.large} align="space-between">
          <HugeTitle top={Spacing.large} text={translate("homeScreen.title")} />
          <IconButton icon="plus" onPress={addSession} />
        </Row>
        <Cell left={Spacing.medium} right={Spacing.medium} top={Spacing.large} bottom={Spacing.large} >
          <SolidButton large type="primary" title={buttonTitle} onPress={handleStartStop} rightIcon={buttonIcon} rightIconSize={Spacing.large} />
        </Cell>
        <Content scrollable innerBottom={bottomOffset}>
          <If condition={!!practiceSessionStore.activeSession}>
            <ActiveSession />
          </If>

          {practiceSessionStore.sessionsCompletedToday.map((practiceSession) => {
            return (
              <Card bottom={Spacing.medium} key={practiceSession.uuid}>
                <LargeTitle>
                  {practiceSession?.formattedDuration.hours}:{practiceSession?.formattedDuration.minutes}
                  <RegularText>
                    {" "}{formatDate(practiceSession.endTime, "dd MMM")}
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
          
          <If condition={!!quoteOfTheDay}>
            <Cell innerHorizontal={Spacing.large} vertical={Spacing.medium}>
              <LabelText align="center">
                "{quoteOfTheDay?.quote}"
              </LabelText>
              <SmallText align="center" top={Spacing.small}>{quoteOfTheDay?.author}</SmallText>
            </Cell>
          </If>
        </Content>
        <If condition={!!practiceSessionStore.activeSession}>
          {/* Modal shown when stopping active practice */}
          <EndPracticeModal ref={editPracticeModalRef} />
        </If>
        {/* Modal shown when manually logging practice */}
        <AddPracticeModal ref={addPracticeModalRef} />
      </Screen>
    )
  }
)
