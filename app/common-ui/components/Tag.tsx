import React, { useMemo, useState } from "react"
import { TouchableOpacity, ColorValue, ViewStyle, TextStyle } from "react-native"
import { Colors, ColorTypes, Palette } from "@common-ui/constants/colors"
import { Spacing } from "@common-ui/constants/spacing"
import { OffsetProps, useOffsetStyles } from "@common-ui/utils/useOffset"
import { LabelText } from "./Text"
import { If } from "./Conditional"
import Icon from "./Icon"
import { Row } from "./Common"

type TagProps = {
  text: string
  tag?: string
  onPress?: (key: string, isSelected: boolean) => void
  type?: keyof typeof ColorTypes
  randomBgColor?: boolean
  textColor?: ColorValue
  backgroundColor?: ColorValue
  style?: ViewStyle
  small?: boolean
} & OffsetProps

const RANDOM_BG_COLORS = [
  Palette.blue800,
  Palette.green800,
  Palette.red800,
  Palette.yellow800,
  Palette.pink800,
]

/**
 * A Tag component useful to drive attention to some texts (mostly statuses)
 * @param {string} text - Text to display in the tag
 * @param {string} tag - tag key used to handle onPress callback
 * @param {onPress} onPress - Callback to call when the tag is pressed
 * @param {keyof typeof ColorTypes} type - Type of tag to display from the ColorTypes
 * @param {boolean} randomBgColor - Whether to use a random background color
 * @param {ColorValue} textColor - Color of the text
 * @param {ColorValue} backgroundColor - Color of the background
 * @param {ViewStyle} style - Style to apply to the tag
 * @param {boolean} small - reduces the Tag paddings to make them smaller
 * @param {OffsetProps} offsetProps - Props to apply offsets to the tag
 *
 * @example
 * <Tag text="1" type="primary" small />
 */
export function Tag(props: TagProps) {
  const { text, tag, onPress, type, randomBgColor, style, textColor, backgroundColor, small, ...offsetProps } = props

  const [isSelected, setIsSelected] = useState(false)
  const randomColor = useMemo(() => RANDOM_BG_COLORS[Math.floor(Math.random() * RANDOM_BG_COLORS.length)], [])

  const toggleSelection = () => {   
    const selected = !isSelected
    
    if (onPress) {
      if (!tag) {
        if (__DEV__) {
          throw new Error("You must provide a tag to the Tag component if you want to use the onPress callback.")
        }

        return
      }

      onPress(tag, selected)
    }

    setIsSelected(selected)
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

    if (randomBgColor) {
      tagStyle.push({ backgroundColor: randomColor })
    }
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
  lineHeight: Spacing.medium,
}
