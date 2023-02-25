import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"

import { MainTabScreenProps } from "@navigators/MainNavigator"
import { translate } from "@i18n/translate"
import { useStores } from "@models/index"

import { Content, Screen } from "@common-ui/components/Screen"
import { HugeTitle, LabelText, LargeTitle, MediumTitle, RegularText, SmallText } from "@common-ui/components/Text"
import { IconButton, LinkButton, SolidButton } from "@common-ui/components/Button"
import { Card } from "@common-ui/components/Card"
import { If } from "@common-ui/components/Conditional"
import { BottomContainer, Cell, Row } from "@common-ui/components/Common"
import { EndPracticeModal, EndPracticeModalHandle } from "@components/EndPraticeModal"

import { Spacing } from "@common-ui/constants/spacing"
import { useInterval } from "@utils/useInterval"
import { AddPracticeModal, AddPracticeModalHandle } from "@components/AddPracticeModal"
import { PracticeItem } from "@components/PracticeItem"
import { useBottomPadding } from "@common-ui/utils/useBottomPadding"
import { calculateDuration } from "@utils/calculateDuration"
import { formatDuration } from "@utils/formatDate"
import { Colors } from "@common-ui/constants/colors"
import Animated, { FadeInDown, FadeOutDown, FadeOutUp } from "react-native-reanimated"
import { Timing } from "@common-ui/constants/timing"

const ActiveSession = observer(
  function ActiveSession(_props) {
    const { practiceSessionStore } = useStores()
    const activeSession = practiceSessionStore.activeSession

    const [duration, setDuration] = useState(activeSession?.duration || 0)

    useInterval(
      () => {
        const newDuration = calculateDuration(new Date().toISOString(), activeSession.startTime)
        setDuration(newDuration)
      },
      practiceSessionStore.isPracticing ? 1000 : null
    )

    const formattedDuration = formatDuration(duration)

    return (
      <Animated.View
        entering={FadeInDown}
      >
        <Card bottom={Spacing.medium} innerVertical={Spacing.large}>
          <LargeTitle align="center" bottom={Spacing.medium}>
            Practice in Progress
          </LargeTitle>
          <HugeTitle align="center" bottom={Spacing.small} color={Colors.primary}>
            {formattedDuration.hours}:{formattedDuration.minutes}:{formattedDuration.seconds}
          </HugeTitle>
          <LabelText align="center">Shhh, let the music flow...</LabelText>
        </Card>
      </Animated.View>
    )
  }
)

export const HomeScreen: FC<MainTabScreenProps<"Home">> = observer(
  function HomeScreen(_props) {
    const { practiceSessionStore, quotesStore, settingsStore } = useStores()

    const editPracticeModalRef = useRef<EndPracticeModalHandle>(null)
    const addPracticeModalRef = useRef<AddPracticeModalHandle>(null)

    const quoteOfTheDay = useMemo(() => quotesStore.randomQuote, [])

    const isPracticing = practiceSessionStore.isPracticing && !!practiceSessionStore.activeSession
    const hasCompletedSessions = !!practiceSessionStore.sessionsCompletedToday.length

    useEffect(() => {
      settingsStore.setInstallDate()
    }, [])

    const handleStartStop = () => {
      if (isPracticing) {
        practiceSessionStore.updateDuration()
        editPracticeModalRef.current?.open()
        return
      }
      
      // Start a new session
      practiceSessionStore.start()
    }

    const addSession = () => {
      addPracticeModalRef.current?.open()
    }
    
    const buttonTitle = isPracticing ? translate("homeScreen.mainButtonTextActive") : translate("homeScreen.mainButtonTextInactive")
    const buttonType = isPracticing ? "danger" : "primary"

    const quoteOffset = useBottomPadding()
    
    return (
      <Screen>
        <Row horizontal={Spacing.medium} top={Spacing.large} align="space-between" justify="flex-start">
          <Cell>
            <LargeTitle bottom={Spacing.extraSmall}>
              Hey 👋
            </LargeTitle>
            <HugeTitle>
              Let's practice!
            </HugeTitle>
          </Cell>
          <Cell>
            <IconButton backgroundColor={Colors.warning} icon="plus" onPress={addSession} />
          </Cell>
        </Row>
        <Cell horizontal={Spacing.medium} vertical={Spacing.larger} >
          <SolidButton
            large
            type={buttonType}
            title={buttonTitle}
            onPress={handleStartStop}
          />
        </Cell>
        <Content scrollable>
          <If condition={!!practiceSessionStore.activeSession}>
            <ActiveSession />
          </If>

          <If condition={hasCompletedSessions && !practiceSessionStore.activeSession}>
            <Card bottom={Spacing.medium} innerVertical={Spacing.large}>
              <MediumTitle align="center" bottom={Spacing.small}>You practiced today</MediumTitle>
              <HugeTitle align="center" bottom={Spacing.small} color={Colors.primary}>
                {practiceSessionStore.totalPracticeTimeToday.hours}hr {practiceSessionStore.totalPracticeTimeToday.minutes}min
              </HugeTitle>
              <LabelText align="center">Keep up the good work!</LabelText>
            </Card>
          </If>

          <If condition={!hasCompletedSessions && !practiceSessionStore.activeSession}>
            <RegularText align="center" bottom={Spacing.larger}>
              You haven't logged any practice sessions{'\n'}today yet.
            </RegularText>

            <LinkButton
              large
              title="Add practice session"
              leftIcon="plus-circle"
              leftIconSize={Spacing.larger}
              textColor={Colors.dark}
              onPress={addSession}
            />
          </If>

          <Cell top={Spacing.small}>
            {/* We could've used FlashList here but since the number of practices per day is small
            it doesn't really make sense for now */}
            {practiceSessionStore.sessionsCompletedToday.map((item) => (
              <PracticeItem item={item} key={item.uuid} />
            ))}
          </Cell>
        </Content>
        <If condition={!!quoteOfTheDay && !hasCompletedSessions}>
          <BottomContainer bottom={quoteOffset}>
            <Cell innerHorizontal={Spacing.large} vertical={Spacing.medium}>
              <LabelText align="center">
                "{quoteOfTheDay?.quote}"
              </LabelText>
              <SmallText align="center" top={Spacing.small}>{quoteOfTheDay?.author}</SmallText>
            </Cell>
          </BottomContainer>
        </If>
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
