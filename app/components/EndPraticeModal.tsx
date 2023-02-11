import React, { ForwardedRef, forwardRef, useImperativeHandle, useMemo, useRef } from "react";

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Cell } from "@common-ui/components/Common";
import { Spacing } from "@common-ui/constants/spacing";
import { EndPracticeForm } from "./EndPracticeForm";
import { useStores } from "@models/index";
import { PracticeSession } from "@models/PracticeSession";
import { Activity } from "@models/Activity";
import { $modalStyle, ModalHeader } from "@common-ui/components/Modal";

export type EndPracticeModalHandle = {
  open: () => void
  close: () => void
}

export const EndPracticeModal = forwardRef<EndPracticeModalHandle, unknown>(function EndPracticeModal(_props: unknown, ref: ForwardedRef<EndPracticeModalHandle>) {
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

  const onSave = (practiceSession: PracticeSession, activities: Array<Activity>) => {
    // Save session
    closeModal()
    practiceSessionStore.stop(practiceSession, activities)
  }

  return (
    <BottomSheetModal
      index={0}
      handleComponent={() => <ModalHeader title="Record Session" onClose={closeModal} />}
      style={$modalStyle}
      name="endPracticeModal"
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDismissOnClose
    >
      <Cell
        flex
        innerHorizontal={Spacing.medium}
      >
        <EndPracticeForm activeSession={practiceSessionStore.activeSession} onSave={onSave} />
      </Cell>
    </BottomSheetModal>
  )
})
