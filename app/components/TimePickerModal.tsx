import React, { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ViewStyle, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomContainer, Cell, Row } from "@common-ui/components/Common";
import { Spacing } from "@common-ui/constants/spacing";
import { $modalStyle, ModalHeader } from "@common-ui/components/Modal";
import { SolidButton } from "@common-ui/components/Button";
import { HugeTitle } from "@common-ui/components/Text";
import { prettifyTime } from "@utils/prettifyTime";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i))
const MINUTES = Array.from({ length: 12 }, (_, i) => {
  return prettifyTime(i * 5)
})
const HOURS_AM_PM = HOURS.slice(0, 12)
const AM_PM = ["AM", "PM"]

const ITEM_SIZE = 44

export type TimePickerModalHandle = {
  open: () => void
  close: () => void
}

type TimePickerModalProps = {
  title?: string
  hours?: number
  minutes?: number
  onSave: (hours: number, minutes: number, amPm?: "AM" | "PM") => void
}

const roundingFunction = (value: number, mode: "minute" | "hour") => {
  if (mode === "minute") {
    return Math.round(value / 5) * 5
  } else {
    return Math.round(value)
  }
}

const TimeItem = ({ item }: { item: string }) => {
  return (
    <Cell height={ITEM_SIZE}>
      <HugeTitle align="center" text={String(item)} />
    </Cell>
  )
}

const List = ({
  data,
  scrollIndex,
  onChange
}: {
  data: Array<string>,
  scrollIndex: number,
  onChange: (value: number) => void
}) => {
  const getItemLayout = useCallback((data: Array<string>, index: number) => ({
    length: ITEM_SIZE,
    offset: ITEM_SIZE * index,
    index,
  }), [])

  const onScrollEnd = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_SIZE)
    onChange(parseInt(data[index]))
    
    Haptics.selectionAsync()
  }, [])

  return <FlatList
    data={data}
    contentContainerStyle={{paddingVertical: ITEM_SIZE * 2}}
    style={{ height: ITEM_SIZE * 5 }}
    keyExtractor={item => String(item)}
    renderItem={({ item }) => <TimeItem item={String(item)} />}
    showsVerticalScrollIndicator={false}
    snapToAlignment="center"
    snapToInterval={ITEM_SIZE}
    decelerationRate="fast"
    overScrollMode="never"
    scrollEventThrottle={150}
    initialScrollIndex={scrollIndex}
    getItemLayout={getItemLayout}
    onMomentumScrollEnd={onScrollEnd}
    onScrollEndDrag={onScrollEnd}
  />
}

export const TimePickerModal = forwardRef<TimePickerModalHandle, TimePickerModalProps>(function TimePickerModal(props: TimePickerModalProps, ref: ForwardedRef<TimePickerModalHandle>) {
  const { title, hours, minutes, onSave } = props

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const { bottom } = useSafeAreaInsets()

  const [hour, setHour] = useState<number>(hours || new Date().getHours())
  const [minute, setMinute] = useState<number>(minutes || new Date().getMinutes())

  const closeModal = () => bottomSheetRef.current?.dismiss()

  const handleSave = () => {
    onSave(hour, minute)
    closeModal()
  }

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.present()
    },
    close: closeModal
  }))

  const hourScrollIndex = useMemo(() => {
    return HOURS.indexOf(String(hour))
  }, [])

  const minuteScrollIndex = useMemo(() => {
    const roundedMinute = roundingFunction(minute, "minute")
    return MINUTES.indexOf(String(roundedMinute))
  }, [])

  return (
    <BottomSheetModal
      index={0}
      handleComponent={() => <ModalHeader title={title || "Set Reminder"} onClose={closeModal} />}
      style={$modalStyle}
      name="setReminderModal"
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDismissOnClose
      enablePanDownToClose={false}
    >
      <Cell
        flex
        innerHorizontal={Spacing.medium}
        bottom={bottom + Spacing.medium}
        horizontal={Spacing.medium}
      >
        <Row height={ITEM_SIZE * 5} bottom={bottom + Spacing.large}>
          <Cell flex></Cell>
          <Cell flex>
            <List
              data={HOURS}
              scrollIndex={hourScrollIndex}
              onChange={setHour}
            />
          </Cell>
          <Cell flex>
            <TimeItem item=":" />
          </Cell>
          <Cell flex>
            <List
              data={MINUTES}
              scrollIndex={minuteScrollIndex}
              onChange={setMinute}
            />
          </Cell>
          <Cell flex></Cell>
        </Row>
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']}
          style={$topLinearBackground}
          locations={[1, 0.8, 0.5, 0.3, 0]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']}
          style={[$bottomLinearBackground, { bottom: bottom + Spacing.large }]}
          locations={[0, 0.3, 0.5, 0.8, 1]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
        <BottomContainer>
          <SolidButton
            large
            title="Save"
            type="primary"
            onPress={handleSave}
          />
        </BottomContainer>
      </Cell>
    </BottomSheetModal>
  )
})

const $topLinearBackground: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: ITEM_SIZE * 2.5,
}

const $bottomLinearBackground: ViewStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: ITEM_SIZE * 2.5,
}
