import { Colors } from "@common-ui/constants/colors"
import { Spacing } from "@common-ui/constants/spacing"
import { Timing } from "@common-ui/constants/timing"
import React, { useMemo, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import { If } from "./Conditional"
import { MediumTitle } from "./Text"

type SliderProps = {
  value: number
  onValueChange: (value: number) => void
  minimumValue: number
  maximumValue: number
  step?: number
  tapToSeek?: boolean
}

const HANDLER_WIDTH = 28

const getSliderValue = (
  offset: number,
  minimumValue: number,
  maximumValue: number,
  sliderWidth: number,
  step: number
) => {
  const fullOffset = offset + HANDLER_WIDTH / 2

  if (fullOffset < 0) {
    return minimumValue
  }

  if (fullOffset >= sliderWidth) {
    return maximumValue
  }

  const sliderValue = Math.floor(fullOffset / sliderWidth * ((maximumValue - minimumValue) / step + step) ) * step
  return sliderValue
}

const normalizeSliderOffset = (
  offset: number,
  minimumValue: number,
  maximumValue: number,
  sliderWidth: number,
  step: number
) => {
  const normalizedValue = getSliderValue(offset, minimumValue, maximumValue, sliderWidth, step)
  const normalizedOffset = normalizedValue / (maximumValue - minimumValue + step) * sliderWidth

  if (normalizedOffset < 0) {
    return 0
  }

  if (normalizedOffset >= sliderWidth) {
    return sliderWidth - HANDLER_WIDTH
  }

  return normalizedOffset
}

export function Slider(props: SliderProps) {
  const { value, onValueChange, minimumValue, maximumValue, step = 1, tapToSeek = true } = props

  const [sliderValue, setSliderValue] = useState(value)
  const [sliderWidth, setSliderWidth] = useState(0)

  const sliderOffset = useSharedValue(0)

  const measureLayout = (event: any) => {
    const { width } = event.nativeEvent.layout
    setSliderWidth(width)
  }

  const updateSliderValue = (value: number) => {
    setSliderValue(value)
    onValueChange(value)
  }

  const slideGesture = useMemo(
    () => 
      Gesture.Pan().runOnJS(true)
      .onChange(({ x }) => {
        const offset = normalizeSliderOffset(x, minimumValue, maximumValue, sliderWidth, step)
        sliderOffset.value = withTiming(offset, { duration: Timing.fast })
        
        updateSliderValue(getSliderValue(x, minimumValue, maximumValue, sliderWidth, step))
      })
      .onFinalize(({ x }) => {
        // This function will be called only when the user releases the slider
        // handler. Even if the user has not moved the handler. This come in handy
        // when the user wants to tap on the slider to seek to a specific time.
        if (!tapToSeek) {
          return
        }

        const offset = normalizeSliderOffset(x, minimumValue, maximumValue, sliderWidth, step)
        sliderOffset.value = withTiming(offset, { duration: Timing.fast })
        
        updateSliderValue(getSliderValue(x, minimumValue, maximumValue, sliderWidth, step))
      }),
    [sliderOffset, tapToSeek, sliderWidth, step, minimumValue, maximumValue],
  )

  const $slideHandlerStyle = useAnimatedStyle(() => ({
    ...$sliderHandler,
    transform: [{ translateX: sliderOffset.value }],
  }), [sliderOffset])

  const $slideFillStyle = useAnimatedStyle(() => ({
    ...$sliderFillStyle,
    width: `${sliderOffset.value/sliderWidth * 100}%`,
  }), [sliderOffset, sliderWidth])

  return (
    <GestureDetector gesture={slideGesture}>
      <View  onLayout={measureLayout} style={$sliderHolder}>
        <View style={$sliderBase}>
          <Animated.View style={$slideFillStyle} />
          <Animated.View style={$slideHandlerStyle}>
            <If condition={!!sliderValue}>
              <MediumTitle>{sliderValue}</MediumTitle>
            </If>
          </Animated.View>
        </View>
      </View>
    </GestureDetector>
  )
}

const $sliderHolder: ViewStyle = {
  width: "100%",
  height: Spacing.extraSmall + 20,
  paddingTop: 10,
  paddingBottom: 10,
}

const $sliderBase: ViewStyle = {
  width: "100%",
  height: Spacing.extraSmall,
  borderRadius: Spacing.extraSmall,
  backgroundColor: Colors.sliderBackground,
}

const $sliderFillStyle: ViewStyle = {
  width: "40%",
  height: Spacing.extraSmall,
  borderRadius: Spacing.extraSmall,
  backgroundColor: Colors.sliderFill,
}

const $sliderHandler: ViewStyle = {
  width: HANDLER_WIDTH,
  height: HANDLER_WIDTH,
  borderRadius: HANDLER_WIDTH,
  backgroundColor: Colors.white,
  borderWidth: Spacing.micro,
  borderColor: Colors.dark,
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  bottom: -10,
  left: 0,
}
