import React from "react"
import { View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

import { MediumTitle } from "./Text"

import { Colors } from "@common-ui/constants/colors"
import { Spacing } from "@common-ui/constants/spacing"
import { OffsetProps, useOffsetStyles } from "@common-ui/utils/useOffset"

type Segment = {
  key: string;
  title: string;
}

type SegmentControlProps = {
  segments: Segment[]
  selectedSegment: string
  onChange: (segment: string) => void
} & OffsetProps


/**
 * SegmentControl is a component that allows the user to select one of a set of options.
 * @param {Segment[]} segments - selectable options
 * @param {string} selectedSegment - selected option
 * @param {function} onChange - callback function to be called when the user selects an option
 * @returns 
 */

export function SegmentControl(props: SegmentControlProps) {
  const { segments, selectedSegment, onChange } = props

  const [selected, setSelected] = React.useState(selectedSegment)

  const onSegmentPress = (segmentKey: string) => {
    setSelected(segmentKey)
    onChange(segmentKey)
  }

  const $style: ViewStyle[] = useOffsetStyles([$segmentHolder], props)

  return (
    <View style={$style}>
      {segments.map((segment) => (
        <SegmentItem
          key={segment.key}
          segment={segment}
          isSelected={segment.key === selected}
          onPress={onSegmentPress}
        />
      ))}
    </View>
  )
}

const SegmentItem = React.memo(function SegmentItem({ segment, isSelected, onPress }: { segment: Segment, isSelected: boolean, onPress: (segmentKey: string) => void }) {
  const key = segment.key

  const handlePress = () => {
    onPress(segment.key)
  }

  const $segmentStyle: ViewStyle = isSelected ? $selectedSegmentStyle : $unselectedSegmentStyle

  return (
    <TouchableOpacity
      key={key}
      onPress={handlePress}
      style={$segmentStyle}
    >
      <MediumTitle muted={!isSelected} align="center">
        {segment.title}
      </MediumTitle>
    </TouchableOpacity>
  )
}, (prevProps, nextProps) => {
  return prevProps.isSelected === nextProps.isSelected
})

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
