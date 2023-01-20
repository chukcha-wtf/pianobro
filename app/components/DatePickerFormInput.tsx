import React, { useState } from "react";
import { Platform, TouchableOpacity, ViewStyle } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Cell, Row } from "@common-ui/components/Common";
import { LargeTitle, MediumText, RegularText } from "@common-ui/components/Text";

import { Spacing } from "@common-ui/constants/spacing";
import { formatDate, formatTime } from "@utils/formatDate";
import { If } from "@common-ui/components/Conditional";
import { Palette } from "@common-ui/constants/colors";

type DatePickerFormInputProps = {
  startTime: string;
  endTime: string;
  onChange: (startTime: string, endTime: string) => void;
}

export function DatePickerFormInput(props: DatePickerFormInputProps) {
  const { startTime, endTime, onChange } = props

  const [mode, setMode] = useState<"starttime" | "endtime" | undefined>(undefined)
  const [pickerMode, setPickerMode] = useState<"date" | "time" | "datetime">(Platform.select({ ios: "datetime", android: "date" }))
  const [showPicker, setShowPicker] = useState(false)

  const editStartTime = () => {
    setShowPicker(mode === "starttime" ? !showPicker : true)

    setMode(mode === "starttime" ? undefined : "starttime")
  }

  const editEndTime = () => {
    setShowPicker(mode === "endtime" ? !showPicker : true)
    
    setMode(mode === "endtime" ? undefined : "endtime")
  }

  const onDateTimeChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date()
    const newStartTime = mode === "starttime" ? currentDate.toISOString() : startTime
    const newEndTime = mode === "endtime" ? currentDate.toISOString() : endTime

    onChange(newStartTime, newEndTime)
  }

  const $startTimeStyle = [$startEndDates]
  const $endTimeStyle = [$startEndDates]

  if (mode === "starttime") {
    $startTimeStyle.push($active)
  }

  if (mode === "endtime") {
    $endTimeStyle.push($active)
  }

  return (
    <>
      <Row bottom={Spacing.medium} align="space-between">
        <MediumText>From</MediumText>
        <TouchableOpacity onPress={editStartTime} style={$startTimeStyle}>
          <Cell>
            <RegularText>{formatDate(startTime, "dd MMM")}</RegularText>
            <LargeTitle>{formatTime(startTime)}</LargeTitle>
          </Cell>
        </TouchableOpacity>
        <MediumText>To</MediumText>
        <TouchableOpacity onPress={editEndTime} style={$endTimeStyle}>
          <Cell>
            <RegularText>{formatDate(endTime, "dd MMM")}</RegularText>
            <LargeTitle>{formatTime(endTime)}</LargeTitle>
          </Cell>
        </TouchableOpacity>
      </Row>
      <If condition={showPicker}>
        <DateTimePicker
          testID="dateTimePicker"
          mode={pickerMode}
          display="spinner"
          value={new Date(mode === "starttime" ? startTime : endTime)}
          onChange={onDateTimeChange}
        />
      </If>
    </>
  )
}

const $startEndDates: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: Spacing.small,
  margin: Spacing.small,
}

const $active: ViewStyle = {
  borderRadius: Spacing.small,
  backgroundColor: Palette.yellow800,
}
