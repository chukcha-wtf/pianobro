import React from "react"
import { View, ViewStyle } from "react-native"

import { LinkButton } from "./Button"
import { LargeTitle } from "./Text"
import { Spacing } from "@common-ui/constants/spacing"
import { Colors } from "@common-ui/constants/colors"
import { Cell } from "./Common"

export const ModalHeader = ({
  title,
  onClose,
}: {
  title: string
  onClose: () => void
}) => {
  return (
    <View style={$header}>
      <LargeTitle align="center">{title}</LargeTitle>
      <View style={$closeButtonHolder}>
        <LinkButton
          icon="x"
          textColor={Colors.dark}
          iconSize={Spacing.larger}
          onPress={onClose}
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

const $header: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: Spacing.medium,
  paddingVertical: Spacing.medium,
}

const $closeButtonHolder: ViewStyle = {
  position: 'absolute',
  right: 0,
}
