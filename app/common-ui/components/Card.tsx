import React from "react"
import { View, StyleSheet, ViewStyle, ColorValue } from "react-native"
import { Colors, ColorTypes } from "@common-ui/constants/colors"
import { OffsetProps, useOffsetStyles } from "@common-ui/utils/useOffset"
import { adjustColor } from "@common-ui/utils/adjustColor"

type CardProps = {
  children: React.ReactNode
  elevated?: boolean
  noBackground?: boolean
  type?: keyof typeof ColorTypes
  outline?: boolean
  backgroundColor?: ColorValue
  noPadding?: boolean
} & OffsetProps

type BaseProps = {
  baseStyle: ViewStyle
} & CardProps

const Base = (props: BaseProps): React.ReactElement => {
  const { children, baseStyle, elevated, noBackground, type, outline, backgroundColor, noPadding, ...offsetProps } =
    props
  let style: ViewStyle[] = [baseStyle]

  style = useOffsetStyles(style, offsetProps)

  if (noBackground) {
    style.push($noBackground)
  }

  if (elevated) {
    style.push($elevated)
  }

  if (noPadding) {
    style.push($noPadding)
  }

  if (type || backgroundColor) {
    const color: ColorValue | undefined = type ? Colors[type] : backgroundColor

    const bordercolor = outline ? color : adjustColor(color, -10)

    const bgColorStyle: ViewStyle = {
      borderBottomColor: bordercolor,
      borderTopColor: bordercolor,
      borderLeftColor: bordercolor,
      borderRightColor: bordercolor,
    }

    if (!outline) {
      bgColorStyle.backgroundColor = color
    }

    style.push(bgColorStyle)
  }

  return <View style={style}>{children}</View>
}

/**
 * A Card component useful to display content in a card like structure
 * @param {React.ReactNode} children - Children to display in the card
 * @param {boolean} elevated - Whether the card should be elevated (shadow displayed)
 * @param {boolean} noBackground - Whether the card should have a background
 * @param {keyof typeof ColorTypes} type - Type of card to display from the ColorTypes
 * @param {boolean} outline - Whether the card should be outlined or filled
 * @param {ColorValue} backgroundColor - Color of the background (default white)
 * @param {boolean} noPadding - Whether the card should have padding (default true)
 * @param {OffsetProps} offsetProps - Props to apply offsets to the card
 * @example
 * <Card type="primary" elevated>
 *  <Text>Some content</Text>
 * </Card>
 */
export function Card({ children, ...props }: CardProps) {
  return (
    <Base baseStyle={$card} {...props}>
      {children}
    </Base>
  )
}

/**
 * A dedicated component to display a card header (with bottom line)
 * @param {React.ReactNode} children - Children to display in the card header
 * @param {boolean} elevated - Whether the card should be elevated (shadow displayed)
 * @param {boolean} noBackground - Whether the card should have a background
 * @param {keyof typeof ColorTypes} type - Type of card to display from the ColorTypes
 * @param {boolean} outline - Whether the card should be outlined or filled
 * @param {ColorValue} backgroundColor - Color of the background (default white)
 * @param {boolean} noPadding - Whether the card should have padding (default true)
 * @param {OffsetProps} offsetProps - Props to apply offsets to the card
 * @example
 * <Card>
 *  <CardHeader type="primary" elevated>
 *    <Text>Some content</Text>
 *  </CardHeader>
 * </Card>
 */
export function CardHeader({ children, ...props }: CardProps) {
  return (
    <Base baseStyle={$cardHeader} {...props}>
      {children}
    </Base>
  )
}

/**
 * A dedicated component to display a card footer (with top line)
 * @param {React.ReactNode} children - Children to display in the card footer
 * @param {boolean} elevated - Whether the card should be elevated (shadow displayed)
 * @param {boolean} noBackground - Whether the card should have a background
 * @param {keyof typeof ColorTypes} type - Type of card to display from the ColorTypes
 * @param {boolean} outline - Whether the card should be outlined or filled
 * @param {ColorValue} backgroundColor - Color of the background (default white)
 * @param {boolean} noPadding - Whether the card should have padding (default true)
 * @param {OffsetProps} offsetProps - Props to apply offsets to the card
 * @example
 * <Card>
 *  <CardFooter type="primary" elevated>
 *    <Text>Some content</Text>
 *  </CardFooter>
 * </Card>
 */
export function CardFooter({ children, ...props }: CardProps) {
  return (
    <Base baseStyle={$cardFooter} {...props}>
      {children}
    </Base>
  )
}

const $card: ViewStyle = {
  backgroundColor: Colors.white,
  borderRadius: 16,
  borderWidth: 2,
  borderColor: Colors.dark,
  padding: 16,
  shadowColor: Colors.dark,
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 4,
  shadowOffset: {
    width: 0,
    height: 4,
  },
}

const $cardHeader: ViewStyle = {
  backgroundColor: Colors.white,
  paddingBottom: 12,
  paddingTop: 12,
  paddingHorizontal: 12,
  marginBottom: 12,
  marginHorizontal: -12,
  marginTop: -12,
  borderBottomWidth: 1,
  borderBottomColor: Colors.lightGrey,
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
}

const $cardFooter: ViewStyle = {
  backgroundColor: Colors.white,
  paddingTop: 12,
  paddingBottom: 12,
  paddingHorizontal: 12,
  marginTop: 12,
  marginHorizontal: -12,
  marginBottom: -12,
  borderTopWidth: 1,
  borderTopColor: Colors.lightGrey,
  borderBottomLeftRadius: 5,
  borderBottomRightRadius: 5,
}

const $noBackground: ViewStyle = {
  backgroundColor: "transparent",
}

const $noPadding: ViewStyle = {
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
}

const $elevated: ViewStyle = {
  shadowColor: "rgba(0,0,0,0.5)",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
}
