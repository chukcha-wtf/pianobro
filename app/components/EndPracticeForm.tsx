import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import Slider from '@react-native-community/slider';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import { ActivityEnum, PracticeSessionModel } from "@models/PracticeSession"

import { LabelText, LargeTitle, MediumTitle } from "@common-ui/components/Text"
import { Cell, Row } from "@common-ui/components/Common"
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
import { Instance } from "mobx-state-tree";
import { If } from "@common-ui/components/Conditional";

type EndPracticeFormProps = {
  activeSession?: Instance<typeof PracticeSessionModel>
  onSave: (practiceSession: Instance<typeof PracticeSessionModel>, activities: Array<keyof typeof ActivityEnum>) => void
}

export const EndPracticeForm = observer(
  function EndPracticeForm(props: EndPracticeFormProps) {
    const { activeSession, onSave } = props

    const [startTime, setStartTime] = useState(activeSession?.startTime || new Date().toISOString())
    const [endTime, setEndTime] = useState(new Date().toISOString())
    const [duration, setDuration] = useState(Math.floor(
      new Date(endTime).getTime() - new Date(startTime).getTime()
    ))
    const [intencity, setIntencity] = useState(0)
    const [satisfaction, setSatisfaction] = useState(0)
    const [notes, setNotes] = useState('')
    const [selectedActivities, setSelectedActivities] = useState<Array<keyof typeof ActivityEnum>>([])

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
          return [...prev, key as keyof typeof ActivityEnum]
        }
        
        return prev.filter((activity) => activity !== key)
      })
    }
  
    const tags = Object.keys(ActivityEnum) as Array<keyof typeof ActivityEnum>
  
    return (
      <>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={$scrollView}>
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
          <Row bottom={Spacing.small} wrap>
            {tags.map((tag) => (
              <Tag
                key={tag}
                tag={tag}
                randomBgColor
                text={ActivityEnum[tag]}
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
        <SolidButton
          large
          type="primary"
          title="Save"
          onPress={saveSession}
        />
      </>
    )
  }
)

const $scrollView: ViewStyle = {
  paddingBottom: Spacing.larger
}
