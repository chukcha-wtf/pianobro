import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"

import { MainTabScreenProps } from "@navigators/MainNavigator"
import { translate } from "@i18n/translate"
import { useStores } from "@models/index"

import { Screen } from "@common-ui/components/Screen"
import { HugeTitle, LabelText, LargeTitle, MediumTitle, RegularText } from "@common-ui/components/Text"
import { IconButton, LinkButton, SolidButton } from "@common-ui/components/Button"
import { Card } from "@common-ui/components/Card"
import { If, Ternary } from "@common-ui/components/Conditional"
import { Cell, Row } from "@common-ui/components/Common"
import { EndPracticeModal, EndPracticeModalHandle } from "@components/EndPraticeModal"

import { Spacing } from "@common-ui/constants/spacing"
import { useInterval } from "@utils/useInterval"
import { AddPracticeModal, AddPracticeModalHandle } from "@components/AddPracticeModal"
import { PracticeItem, PRACTICE_ITEM_HEIGHT } from "@components/PracticeItem"
import { useBottomPadding } from "@common-ui/utils/useBottomPadding"
import { calculateDuration } from "@utils/calculateDuration"
import { formatDuration } from "@utils/formatDate"
import { Colors } from "@common-ui/constants/colors"
import Animated, { FadeInDown } from "react-native-reanimated"
import QuoteOfTheDay from "@components/QuoteOfTheDay"
import { FlashList } from "@shopify/flash-list"
import { FLASH_LIST_OFFSET } from "./ActivityDetailsScreen"
import { PracticeSession } from "@models/PracticeSession"
import Insights from "@components/Insights"

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
            {translate("homeScreen.activeSession.title")}
          </LargeTitle>
          <HugeTitle align="center" bottom={Spacing.small} color={Colors.primary}>
            {formattedDuration.hours}:{formattedDuration.minutes}:{formattedDuration.seconds}
          </HugeTitle>
          <LabelText align="center">
            {translate("homeScreen.activeSession.subtitle")}
          </LabelText>
        </Card>
      </Animated.View>
    )
  }
)

function HeaderComponent({ hasCompletedSessions }: { hasCompletedSessions: boolean }) {
  const { practiceSessionStore, statisticsStore } = useStores()

  return (
    <Cell right={FLASH_LIST_OFFSET}>
      <Ternary condition={!!practiceSessionStore.activeSession}>
        <ActiveSession />
        <If condition={hasCompletedSessions}>
          {/* Display Hours played for today */}
          <Card bottom={Spacing.medium} innerVertical={Spacing.large}>
            <MediumTitle align="center" bottom={Spacing.small}>
              {translate("homeScreen.practicedToday")}
            </MediumTitle>
            <HugeTitle align="center" bottom={Spacing.small} color={Colors.primary}>
              {statisticsStore.totalPracticeTimeToday.hours}{translate("common.hr")} {statisticsStore.totalPracticeTimeToday.minutes}{translate("common.min")}
            </HugeTitle>
            <LabelText align="center">
              {translate("homeScreen.keepUpGoodWork")}
            </LabelText>
          </Card>
        </If>
      </Ternary>
    </Cell>
  )
}

function EmptyComponent({ addSession }: { addSession: () => void }) {
  const { practiceSessionStore, hasInsights } = useStores()

  const hasProgressInsights = hasInsights()
  const quotesOffset = hasProgressInsights ? Spacing.medium : Spacing.extraHuge

  return (
    <Cell right={FLASH_LIST_OFFSET}>
      <Ternary condition={hasProgressInsights}>
        <Insights />
        <If condition={!practiceSessionStore.activeSession}>
          <RegularText align="center" bottom={Spacing.larger}>
            {translate("homeScreen.noSessionsLogged")}
          </RegularText>

          <LinkButton
            large
            title={translate("homeScreen.addSessionLink")}
            leftIcon="plus-circle"
            leftIconSize={Spacing.larger}
            textColor={Colors.dark}
            onPress={addSession}
          />
        </If>
      </Ternary>
      <Cell top={quotesOffset}>
        <QuoteOfTheDay />
      </Cell>
    </Cell>
  )
}

const renderListItem = ({ item }: { item: PracticeSession }) => {
  return (
    <Cell right={FLASH_LIST_OFFSET}>
      <PracticeItem item={item} />
    </Cell>
  )
}

export const HomeScreen: FC<MainTabScreenProps<"Home">> = observer(
  function HomeScreen(_props) {
    const { practiceSessionStore, settingsStore, statisticsStore } = useStores()

    const bottomPadding = useBottomPadding()

    const editPracticeModalRef = useRef<EndPracticeModalHandle>(null)
    const addPracticeModalRef = useRef<AddPracticeModalHandle>(null)

    const isPracticing = practiceSessionStore.isPracticing && !!practiceSessionStore.activeSession
    const hasCompletedSessions = !!statisticsStore.todayCompletedSessionUUids.length
    const sessionsToday = practiceSessionStore.getSessionsFromUuids(statisticsStore.todayCompletedSessionUUids)

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

    const $scrollViewContent = {
      paddingBottom: bottomPadding,
    }
    
    return (
      <Screen>
        <Row horizontal={Spacing.medium} top={Spacing.large} align="space-between" justify="flex-start">
          <Cell>
            <LargeTitle bottom={Spacing.extraSmall}>
              {translate("homeScreen.title")}
            </LargeTitle>
            <HugeTitle>
              {translate("homeScreen.subtitle")}
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
        <Cell
          flex
          innerLeft={Spacing.medium}
          innerRight={Spacing.medium - FLASH_LIST_OFFSET}
        >
          <FlashList
            data={sessionsToday}
            keyExtractor={(item) => item.uuid}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={PRACTICE_ITEM_HEIGHT}
            contentContainerStyle={$scrollViewContent}
            renderItem={renderListItem}
            ListHeaderComponent={
              <HeaderComponent
                hasCompletedSessions={hasCompletedSessions}
              />
            }
            ListEmptyComponent={<EmptyComponent addSession={addSession} />}
          />
        </Cell>
        
        {/* Modal shown when stopping active practice */}
        <If condition={!!practiceSessionStore.activeSession}>
          <EndPracticeModal ref={editPracticeModalRef} />
        </If>
        
        {/* Modal shown when manually logging practice */}
        <AddPracticeModal ref={addPracticeModalRef} />
      </Screen>
    )
  }
)
