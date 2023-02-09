import React from "react"
import { View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

import { MediumTitle } from "./Text"

import { Colors } from "@common-ui/constants/colors"
import { Spacing } from "@common-ui/constants/spacing"
import { OffsetProps, useOffsetStyles } from "@common-ui/utils/useOffset"

type SegmentControlProps = {
  capitalize?: boolean
  segments: string[]
  selectedSegment: string
  onChange: (segment: string) => void
} & OffsetProps


/**
 * SegmentControl is a component that allows the user to select one of a set of options.
 * @param {string[]} segments - selectable options
 * @param {boolean} capitalize - whether to capitalize the options
 * @param {string} selectedSegment - selected option
 * @param {function} onChange - callback function to be called when the user selects an option
 * @returns 
 */

export function SegmentControl(props: SegmentControlProps) {
  const { segments, capitalize, selectedSegment, onChange } = props

  const [selected, setSelected] = React.useState(selectedSegment)

  const onSegmentPress = (segment: string) => {
    setSelected(segment)
    onChange(segment)
  }

  const $style: ViewStyle[] = useOffsetStyles([$segmentHolder], props)

  return (
    <View style={$style}>
      {segments.map((segment) => {
        const key = segment.split(" ").join("_")
        const isSelected = segment === selected

        const handlePress = () => {
          onSegmentPress(segment)
        }

        const segmentText = capitalize ?
          segment.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") :
          segment
        const $segmentStyle: ViewStyle = isSelected ? $selectedSegmentStyle : $unselectedSegmentStyle

        return (
          <TouchableOpacity
            key={key}
            onPress={handlePress}
            style={$segmentStyle}
          >
            <MediumTitle muted={!isSelected} align="center">
              {segmentText}
            </MediumTitle>
          </TouchableOpacity>
        )

      })}
    </View>
  )
}

const $segmentHolder: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

const $selectedSegmentStyle: ViewStyle = {
  flex: 1,
  borderRadius: 20,
  paddingHorizontal: Spacing.medium,
  paddingVertical: Spacing.extraSmall,
  backgroundColor: "transparent",
  borderWidth: 2,
  borderColor: Colors.dark,
}

const $unselectedSegmentStyle: ViewStyle = {
  flex: 1,
  borderRadius: 20,
  paddingHorizontal: Spacing.medium,
  paddingVertical: Spacing.extraSmall,
  backgroundColor: "transparent",
  borderWidth: 2,
  borderColor: Colors.transparent,
}
