import React from "react"
import { View, ViewStyle } from "react-native"

import { LinkButton } from "./Button"
import { LargeTitle } from "./Text"
import { Spacing } from "@common-ui/constants/spacing"
import { Colors } from "@common-ui/constants/colors"

export const ModalHeader = ({
  title,
  bgColor,
  onClose,
}: {
  title: string
  bgColor?: string
  onClose: () => void
}) => {
  const $style = [$header]

  if (bgColor) {
    $style.push({ backgroundColor: bgColor })
  }
  
  return (
    <View style={$style}>
      <LargeTitle align="center">{title}</LargeTitle>
      <View style={$closeButtonHolder}>
        <LinkButton
          icon="x"
          textColor={Colors.dark}
          iconSize={Spacing.larger}
          onPress={onClose}
          innerRight={Spacing.extraSmall}
        />
      </View>
    </View>
  )
}

export const $modalStyle: ViewStyle = {
  borderTopLeftRadius: Spacing.medium,
  borderTopRightRadius: Spacing.medium,
  borderWidth: 2,
  borderColor: Colors.dark,
}

export const $modalBackdropStyle: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(24, 25, 31, 0.2)",
}

const $header: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: Spacing.medium,
  paddingVertical: Spacing.medium,
  borderTopLeftRadius: Spacing.medium,
  borderTopRightRadius: Spacing.medium,
  backgroundColor: Colors.grayBackground,
}

const $closeButtonHolder: ViewStyle = {
  position: 'absolute',
  right: 0,
}
