import React, { FC, useMemo, useRef } from "react"
import { observer } from "mobx-react-lite"

import { MainTabScreenProps } from "@navigators/MainNavigator"
import { translate } from "@i18n/translate"
import { useStores } from "@models/index"
import { ActivityEnum } from "@models/PracticeSession"

import { Content, Screen } from "@common-ui/components/Screen"
import { HugeTitle, LabelText, LargeTitle, MediumTitle, RegularText, SmallText } from "@common-ui/components/Text"
import { IconButton, LinkButton, SolidButton } from "@common-ui/components/Button"
import { Card } from "@common-ui/components/Card"
import { If } from "@common-ui/components/Conditional"
import { Cell, Row } from "@common-ui/components/Common"
import { EndPracticeModal, EndPracticeModalHandle } from "@components/EndPraticeModal"

import { Spacing } from "@common-ui/constants/spacing"
import { useInterval } from "@utils/useInterval"
import { formatDate } from "@utils/formatDate"
import { AddPracticeModal, AddPracticeModalHandle } from "@components/AddPracticeModal"
import { Colors } from "react-native/Libraries/NewAppScreen"
import Icon from "@common-ui/components/Icon"
import { Palette } from "@common-ui/constants/colors"

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
        <HugeTitle align="center" bottom={Spacing.small}>
          {practiceSessionStore.activeSession?.formattedDuration.hours}:{practiceSessionStore.activeSession?.formattedDuration.minutes}
          <LargeTitle> {practiceSessionStore.activeSession?.formattedDuration.seconds}</LargeTitle>
        </HugeTitle>
        <LabelText align="center">Shhh, let the music flow...</LabelText>
      </Card>
    )
  }
)

const PracticeItem = function PracticeItem({ item }) {
  const activitiesText = item.activities.map((activity) => ActivityEnum[activity]).join(", ")
  const satisfactionStars = Array.from({ length: item.satisfaction }, (_, i) => i)

  return (
    <Card bottom={Spacing.medium} key={item.uuid}>
      <Row align="space-between">
        <LargeTitle>
          {item.formattedDuration.hours}:{item.formattedDuration.minutes}
          <RegularText>
            {" "}{formatDate(item.endTime, "dd MMM")}
          </RegularText>
        </LargeTitle>
        <Cell>
          <Row>
            {satisfactionStars.map((_, i) => (
              <Icon key={i} color={Palette.yellow} name="star" size={Spacing.small} />
            ))}
          </Row>
        </Cell>
      </Row>
      <Row top={Spacing.extraSmall}>
        <LabelText text={activitiesText} />
      </Row>
    </Card>
  )
}

export const HomeScreen: FC<MainTabScreenProps<"Home">> = observer(
  function HomeScreen(_props) {
    const { practiceSessionStore, quotesStore } = useStores()

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
          <HugeTitle text={translate("homeScreen.title")} />
          <IconButton icon="plus" onPress={addSession} />
        </Row>
        <Cell horizontal={Spacing.medium} vertical={Spacing.large} >
          <SolidButton
            large
            type="primary"
            title={buttonTitle}
            onPress={handleStartStop}
            rightIcon={buttonIcon}
            rightIconSize={Spacing.large}
          />
        </Cell>
        <Content scrollable>
          <If condition={!!practiceSessionStore.activeSession}>
            <ActiveSession />
          </If>

          <If condition={!!practiceSessionStore.sessionsCompletedToday.length && !practiceSessionStore.activeSession}>
            <Card type="success" bottom={Spacing.medium} innerVertical={Spacing.large}>
              <MediumTitle align="center" bottom={Spacing.small}>You practiced today for</MediumTitle>
              <HugeTitle align="center" bottom={Spacing.small}>
                {practiceSessionStore.totalPracticeTimeToday.hours} {practiceSessionStore.totalPracticeTimeToday.minutes}
              </HugeTitle>
              <LabelText align="center">Keep up the good work!</LabelText>
            </Card>
          </If>

          <If condition={!practiceSessionStore.sessionsCompletedToday.length && !practiceSessionStore.activeSession}>
            <RegularText align="center">
              You haven't logged any practice sessions{'\n'}today yet.
            </RegularText>

            <LinkButton
              large
              title="Add practice session"
              leftIcon="plus-circle"
              leftIconSize={Spacing.large}
              textColor={Colors.dark}
              onPress={addSession}
            />
          </If>

          {/* We could've used FlashList here but since the number of practices per day is small
          it doesn't really make sense for now */}
          {practiceSessionStore.sessionsCompletedToday.map((item) => (
            <PracticeItem item={item} key={item.uuid} />
          ))}
          
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
