import React from "react"
import { ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

import { Row } from "@common-ui/components/Common"
import { StarFilled } from "@common-ui/components/Icon"
import { Spacing } from "@common-ui/constants/spacing"
import { Colors } from "@common-ui/constants/colors"

type StarPickerProps = {
  count: number
  value: number
  onChange: (value: number) => void
}

const Star = ({ selected, value, onPress }) => {
  const handlePress = () => {
    onPress(value)
  }

  return (
    <TouchableOpacity style={$star} onPress={handlePress}>
      <StarFilled color={selected ? Colors.warning : Colors.grayBackground} size={Spacing.large} />
    </TouchableOpacity>
  )
}

export function StarPicker(props: StarPickerProps) {
  const { count, value, onChange } = props

  const [stars, setStars] = React.useState(value)

  const handleChange = (value) => {
    setStars(value)
    onChange(value)
  }

  const countMap = Array.from(Array(count).keys())  

  return (
    <Row align="space-between">
      {countMap.map((i) => (
        <Star key={i} value={i + 1} selected={i < stars} onPress={handleChange} />
      ))}
    </Row>
  )
}

const $star: ViewStyle = {
  flex: 1,
  padding: Spacing.small,
}
