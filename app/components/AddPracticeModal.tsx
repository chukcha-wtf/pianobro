import React, { ForwardedRef, forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { View, ViewStyle } from "react-native";

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ExtraLargeTitle } from "@common-ui/components/Text";
import { LinkButton } from "@common-ui/components/Button";
import { Cell } from "@common-ui/components/Common";
import { Spacing } from "@common-ui/constants/spacing";
import { Colors } from "@common-ui/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EndPracticeForm } from "./EndPracticeForm";
import { useStores } from "@models/index";
import { Instance } from "mobx-state-tree";
import { ActivityEnum, PracticeSessionModel } from "@models/PracticeSession";

export type AddPracticeModalHandle = {
  open: () => void
  close: () => void
}

const HandleComponent = ({ closeModal }) => (
  <View style={$header}>
    <ExtraLargeTitle>Add Session</ExtraLargeTitle>
    <LinkButton
      icon="x"
      textColor={Colors.dark}
      iconSize={Spacing.larger}
      onPress={closeModal}
    />
  </View>
)

export const AddPracticeModal = forwardRef<AddPracticeModalHandle, unknown>(function AddPracticeModal(_props: unknown, ref: ForwardedRef<EndPracticeModalHandle>) {
  const { bottom } = useSafeAreaInsets()
  const { practiceSessionStore } = useStores()

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['90%'], []);

  const closeModal = () => bottomSheetRef.current?.dismiss()

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.present()
    },
    close: closeModal
  }))

  const onSave = (practiceSession: Instance<typeof PracticeSessionModel>, activities: Array<keyof typeof ActivityEnum>) => {
    // Save session
    closeModal()
    practiceSessionStore.addSession(practiceSession, activities)
  }

  return (
    <BottomSheetModal
      index={0}
      handleComponent={() => <HandleComponent closeModal={closeModal} />}
      style={$modalStyle}
      name="endPracticeModal"
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDismissOnClose
    >
      <Cell
        flex
        justify="space-between"
        innerHorizontal={Spacing.medium}
        bottom={bottom + Spacing.medium}
      >
        <EndPracticeForm onSave={onSave} />
      </Cell>
    </BottomSheetModal>
  )
})

const $modalStyle: ViewStyle = {
  borderTopLeftRadius: Spacing.medium,
  borderTopRightRadius: Spacing.medium,
  borderWidth: 2,
  borderColor: Colors.dark,
}

const $header: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: Spacing.medium,
  paddingVertical: Spacing.small,
  borderBottomColor: Colors.dark,
  borderBottomWidth: 2,
}