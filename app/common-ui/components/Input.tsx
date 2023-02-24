import React from "react"
import { TextInput, TextInputProps, TextStyle } from "react-native"

import { Colors } from "@common-ui/constants/colors"
import { Spacing } from "@common-ui/constants/spacing"
import { Typography } from "@common-ui/constants/typography"

type InputProps = {
  value: string
  placeholder?: string
  onChangeText: (value: string) => void
  style?: TextStyle
}& TextInputProps

function BaseInput(props: InputProps) {
  const { value, placeholder, onChangeText, style, ...rest } = props

  const styles = [$input, style]
  
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
      style={[$input, styles]}
      {...rest}
    />
  )
}

/**
 * SmallInput - single line text input
 * @param value - value of the input
 * @param placeholder - placeholder text
 * @param onChangeText - callback when text changes
 * @param style - style object
 * @param rest - other TextInput props
 */
export function SmallInput(props: InputProps) {
  return <BaseInput
    cursorColor={Colors.dark}
    placeholderTextColor={Colors.darkGrey}
    {...props}
    style={[$smallInput, props.style]}
  />
}

/**
 * LargeInput - multiline text input
 * @param value - value of the input
 * @param placeholder - placeholder text
 * @param onChangeText - callback when text changes
 * @param style - style object
 * @param rest - other TextInput props
 */
export function LargeInput(props: InputProps) {
  return <BaseInput
    multiline
    placeholderTextColor={Colors.darkGrey}
    {...props}
    style={[$largeInput, props.style]}
  />
}

const $input: TextStyle = {
  borderWidth: 2,
  borderColor: Colors.dark,
  borderRadius: Spacing.medium,
  color: Colors.dark,
  paddingHorizontal: Spacing.medium,
  paddingVertical: Spacing.medium,
  backgroundColor: Colors.white,
  ...Typography.largeTitle
}

const $smallInput: TextStyle = {
}

const $largeInput: TextStyle = {
  height: 120,
  paddingTop: Spacing.medium,
}
