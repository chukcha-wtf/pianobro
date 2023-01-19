import React, { useState } from "react"
import { TouchableOpacity, ColorValue, ViewStyle, TextStyle } from "react-native"
import { Colors, ColorTypes } from "@common-ui/constants/colors"
import { Spacing } from "@common-ui/constants/spacing"
import { OffsetProps, useOffsetStyles } from "@common-ui/utils/useOffset"
import { LabelText } from "./Text"
import { If } from "./Conditional"
import Icon from "./Icon"
import { Row } from "./Common"

type TagProps = {
  text: string
  key?: string
  onPress?: (key: string, isSelected: boolean) => void
  type?: keyof typeof ColorTypes
  textColor?: ColorValue
  backgroundColor?: ColorValue
  style?: ViewStyle
  small?: boolean
} & OffsetProps

/**
 * A Tag component useful to drive attention to some texts (mostly statuses)
 * @param {string} text - Text to display in the tag
 * @param {keyof typeof ColorTypes} type - Type of tag to display from the ColorTypes
 * @param {ColorValue} textColor - Color of the text
 * @param {ColorValue} backgroundColor - Color of the background
 * @param {ViewStyle} style - Style to apply to the tag
 * @param {boolean} small - reduces the Tag paddings to make them smaller
 * @param {OffsetProps} offsetProps - Props to apply offsets to the tag
 *
 * @example
 * <Tag text="1" type="primary" small />
 */
export default function Tag(props: TagProps) {
  const { text, key, onPress, type, style, textColor, backgroundColor, small, ...offsetProps } = props

  const [isSelected, setIsSelected] = useState(false)

  const toggleSelection = () => {
    setIsSelected(!isSelected)
   
    if (onPress) {
      if (!key) {
        if (__DEV__) {
          throw new Error("You must provide a key to the Tag component if you want to use the onPress callback.")
        }

        return
      }

      onPress(key, isSelected)
    }
  }

  let tagStyle: ViewStyle[] = [$tag]
  const textStyle: TextStyle[] = [$text]

  tagStyle = useOffsetStyles(tagStyle, offsetProps)

  if (type) {
    tagStyle.push({ backgroundColor: Colors[type] })
  }

  if (backgroundColor) {
    tagStyle.push({ backgroundColor })
  }

  if (textColor) {
    textStyle.push({ color: textColor })
  }

  if (small) {
    tagStyle.push($smallTag)
  }

  if (isSelected) {
    tagStyle.push($tagSelected)
  }

  if (style) {
    tagStyle.push(style)
  }

  return (
    <TouchableOpacity style={tagStyle} onPress={toggleSelection}>
      <Row>
        <LabelText textStyle={textStyle}>{text}</LabelText>
        <If condition={isSelected}>
          <Icon name="x" left={Spacing.tiny} size={Spacing.medium} color={Colors.dark} />
        </If>
      </Row>
    </TouchableOpacity>
  )
}

const $tag: ViewStyle = {
  alignItems: "center",
  borderWidth: 2,
  backgroundColor: Colors.white,
  borderRadius: Spacing.extraLarge,
  borderColor: Colors.dark,
  justifyContent: "center",
  paddingHorizontal: Spacing.small,
  paddingVertical: Spacing.extraSmall,
}

const $tagSelected: ViewStyle = {
  backgroundColor: Colors.tagBackground,
}

const $smallTag: ViewStyle = {
  paddingHorizontal: Spacing.small,
  paddingVertical: Spacing.tiny,
}

const $text: TextStyle = {
  color: Colors.dark,
}
