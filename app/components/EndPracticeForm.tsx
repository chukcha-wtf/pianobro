import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import Slider from '@react-native-community/slider';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import { PracticeSession } from "@models/PracticeSession"

import { LabelText, LargeTitle, MediumTitle } from "@common-ui/components/Text"
import { BottomContainer, Cell, Row } from "@common-ui/components/Common"
import { Tag } from "@common-ui/components/Tag"
import { SolidButton } from "@common-ui/components/Button"

import { Spacing } from "@common-ui/constants/spacing"
import { Colors } from "@common-ui/constants/colors"
import { DatePickerFormInput } from "./DatePickerFormInput"
import { calculateDuration } from "@utils/calculateDuration"
import { formatDuration } from "@utils/formatDate"
import { ViewStyle } from "react-native";
import { StarPicker } from "./StarPicker";
import { LargeInput } from "@common-ui/components/Input";
import { If } from "@common-ui/components/Conditional";
import { ACTIVITIES, Activity } from "@models/Activity";
import { useBottomPadding } from "@common-ui/utils/useBottomPadding";

type EndPracticeFormProps = {
  activeSession?: PracticeSession
  onSave: (practiceSession: PracticeSession, activities: Array<Activity>) => void
}

export const EndPracticeForm = observer(
  function EndPracticeForm(props: EndPracticeFormProps) {
    const { activeSession, onSave } = props

    const bottomPadding = useBottomPadding()

    const [startTime, setStartTime] = useState(activeSession?.startTime || new Date().toISOString())
    const [endTime, setEndTime] = useState(activeSession?.endTime || new Date().toISOString())
    const [duration, setDuration] = useState(Math.floor(
      new Date(endTime).getTime() - new Date(startTime).getTime()
    ))
    const [intencity, setIntencity] = useState(0)
    const [satisfaction, setSatisfaction] = useState(0)
    const [notes, setNotes] = useState('')
    const [selectedActivities, setSelectedActivities] = useState<Array<Activity>>([])

    const saveSession = () => {
      const session = { ...activeSession }
  
      session.startTime = startTime
      session.endTime = endTime
      session.duration = duration
      session.intencity = intencity
      session.satisfaction = satisfaction
      session.notes = notes
            
      onSave(session, selectedActivities)
    }

    const onTimeChange = (startTime: string, endTime: string) => {
      setStartTime(startTime)
      setEndTime(endTime)

      setDuration(calculateDuration(startTime, endTime))
    }
  
    const handleTagPress = (key: string, isSelected: boolean) => {
      setSelectedActivities((prev) => {
        if (isSelected) {
          const activity = ACTIVITIES.find((activity) => activity.uuid === key)

          return [...prev, activity]
        }
        
        return prev.filter((activity) => activity.uuid !== key)
      })
    }

    const $scrollView: ViewStyle = { paddingBottom: bottomPadding + Spacing.huge }
    
    return (
      <>
        <KeyboardAwareScrollView
          extraScrollHeight={Spacing.medium}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={$scrollView}>
          {/* Duration Selection */}
          <LargeTitle top={Spacing.medium}>
            <MediumTitle>You've played </MediumTitle>
            {formatDuration(duration).hours}:{formatDuration(duration).minutes}
            <If condition={!!activeSession}>
              <MediumTitle> today</MediumTitle>
            </If>
          </LargeTitle>
          <DatePickerFormInput startTime={startTime} endTime={endTime} onChange={onTimeChange} />
          {/* Activities Selection */}
          <LabelText bottom={Spacing.extraSmall} color={Colors.midGrey}>What have you practiced?</LabelText>
          <Row bottom={Spacing.small} wrap align="center">
            {ACTIVITIES.map((activity) => (
              <Tag
                key={activity.uuid}
                tag={activity.uuid}
                randomBgColor
                text={activity.name}
                onPress={handleTagPress}
                bottom={Spacing.extraSmall}
                left={Spacing.tiny}
              />
            ))}
          </Row>
          {/* Intencity */}
          <LabelText bottom={Spacing.extraSmall} color={Colors.midGrey}>Was it hard?</LabelText>
          <Cell bottom={Spacing.medium}>
            <Slider
              tapToSeek
              step={1}
              minimumValue={0}
              maximumValue={10}
              value={intencity}
              onValueChange={setIntencity}
            />
            <Row align="space-between">
              <MediumTitle>0</MediumTitle>
              <MediumTitle>10</MediumTitle>
            </Row>
          </Cell>
          {/* Satisfaction */}
          <LabelText bottom={Spacing.extraSmall} color={Colors.midGrey}>Was it fun?</LabelText>
          <StarPicker count={5} value={satisfaction} onChange={setSatisfaction} />
          <LabelText top={Spacing.medium} bottom={Spacing.extraSmall} color={Colors.midGrey}>Notes</LabelText>
          <LargeInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add details..."
          />
        </KeyboardAwareScrollView>
        <BottomContainer
          withGradient
          innerTop={Spacing.large}
          innerBottom={Spacing.button}
          innerHorizontal={Spacing.medium}>
          <SolidButton
            large
            type="primary"
            title="Save"
            onPress={saveSession}
          />
        </BottomContainer>
      </>
    )
  }
)
