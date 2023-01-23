import React from "react"
import { View, ScrollView, ViewProps, ScrollViewProps, ViewStyle, SafeAreaView } from "react-native"
import { Colors } from "@common-ui/constants/colors"
import { Spacing } from "@common-ui/constants/spacing"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { OffsetProps, useOffsetStyles } from "@common-ui/utils/useOffset"

export type ContentProps = {
  children: React.ReactNode
  padding?: number
  noPadding?: boolean
  noBackground?: boolean
  backgroundColor?: string
  style?: ViewStyle
  scrollViewStyle?: ScrollViewProps
  scrollable?: boolean
} & OffsetProps & ViewProps &
  ScrollViewProps

/**
 * Generic Content wrapper for Screens with default padding. It can either be scrollable or not.
 * @param {React.ReactNode} children - content to wrap
 * @param {boolean} noPadding - disable inner padding (default false)
 * @param {boolean} noBackground - disable default background color (defaults to gray)
 * @param {string} backgroundColor - set background color
 * @param {ViewStyle} style - extra styles for the non-scrollable <Content />
 * @param {ScrollViewProps} scrollViewStyle - extra styles for the scrollable <Content />
 * @param {boolean} scrollable - whether the content is scrollable or not
 * @example
 * <Content scrollable>
 *   <Text>Some content</Text>
 * </Content>
 */
export const Content = (props: ContentProps) => {
  const { children, noPadding, noBackground, backgroundColor, style, scrollViewStyle, scrollable, ...rest } =
    props
  const Container = scrollable ? ScrollView : View

  const holderStyles: ViewStyle[] = useOffsetStyles([$content], rest)
  const scrollStyles: ViewStyle[] = [$scrollView]

  if (noBackground) {
    holderStyles.push($noBackground)
    scrollStyles.push($noBackground)
  }

  if (backgroundColor) {
    holderStyles.push({ backgroundColor })
    scrollStyles.push({ backgroundColor })
  }

  if (noPadding) {
    holderStyles.push($noPadding)
    scrollStyles.push($noPadding)
  }

  if (style) {
    holderStyles.push(style)
  }

  if (scrollViewStyle) {
    scrollStyles.push(scrollViewStyle)
  }

  return (
    <Container showsVerticalScrollIndicator={false} style={scrollStyles}>
      <View style={holderStyles} {...rest}>
        {children}
      </View>
    </Container>
  )
}

/**
 * Screen - generic wrapper for screens. Includes SafeAreaView and ErrorBoundary
 * @param {React.ReactNode} children - inner content for Screen component
 * @example
 * <Screen>
 *  <Content>
 *    <Text>Some Text</Text>
 *  </Content>
 * </Screen>
 */
export const Screen = ({ children }: { children: React.ReactNode }) => {
  const tabBarHeight = useBottomTabBarHeight()

  return (
    <SafeAreaView style={[$container, { paddingBottom: tabBarHeight + Spacing.larger }]}>
      {children}
    </SafeAreaView>
  )
}

const $container: ViewStyle = { flex: 1, backgroundColor: Colors.lightGrey, }

const $content: ViewStyle = {
  padding: Spacing.small,
  backgroundColor: Colors.lightGrey,
}

const $scrollView: ViewStyle = {
  flex: 1,
  backgroundColor: Colors.lightGrey,
}

const $noBackground: ViewStyle = {
  backgroundColor: Colors.transparent,
}

const $noPadding: ViewStyle = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
}
