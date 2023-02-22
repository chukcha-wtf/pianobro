/**
 * AlertContext - Context provider for alert messages
 */

import React, { createContext, useState } from 'react';
import { Modal, Pressable, View, ViewStyle } from 'react-native';

import { LargeTitle, RegularText } from '@common-ui/components/Text';
import { Spacing } from '@common-ui/constants/spacing';
import { Colors } from '@common-ui/constants/colors';
import { Row } from '@common-ui/components/Common';
import { If, Ternary } from '@common-ui/components/Conditional';
import { OutlinedButton, SolidButton } from '@common-ui/components/Button';

type ButtonAction = {
  text: string,
  onPress: () => void,
}

type Alert = {
  title: string,
  message: string,
  actions: ButtonAction[],
}

const AlertContext = createContext({
  showAlert: (
    _title: string,
    _message: string,
    _actions: ButtonAction[],
  ) => undefined,

  hideAlert: () => undefined,
});

export const useAlert = () => React.useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState<Alert | null>(null)

  const showAlert = (title: string, message: string, actions: ButtonAction[]) => {
    setAlert({ title, message, actions })
  }

  const hideAlert = () => {
    setAlert(null)
  }

  const onCancelPress = () => {
    if (alert?.actions.length === 2) {
      alert.actions[0].onPress()
    }
    hideAlert()
  }

  const onConfirmPress = () => {
    if (alert?.actions.length === 2) {
      alert.actions[1].onPress()
    } else {
      alert.actions[0].onPress()
    }
    hideAlert()
  }

  const contextValue = {
    showAlert,
    hideAlert,
  }
  
  const hasCancelButton = alert?.actions?.length === 2
  const leftButtonText = hasCancelButton ? alert?.actions[0].text : "Cancel"
  const rightButtonText = hasCancelButton ? alert?.actions[1].text : alert?.actions[0].text
  
  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      
      <Modal
        visible={!!alert}
        transparent
        animationType="fade"
        onRequestClose={hideAlert}
      >
        <Pressable style={$alertContentHolder}>
          <View style={$alertContent}>
            <If condition={!!alert}>
              <LargeTitle align='center' bottom={Spacing.medium}>
                {alert?.title}
              </LargeTitle>
              <RegularText align='center'>
                {alert?.message}
              </RegularText>
              <Row
                top={Spacing.large}
                height={Spacing.button}
                align='center'
              >
                <OutlinedButton
                  minWidth={100}
                  title={leftButtonText}
                  onPress={onCancelPress}
                />
                <SolidButton
                  minWidth={100}
                  left={Spacing.large}
                  type="primary"
                  title={rightButtonText}
                  onPress={onConfirmPress}
                />
              </Row>
            </If>
          </View>
        </Pressable>
      </Modal>
    </AlertContext.Provider>
  )
}

const $alertContentHolder: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
}

const $alertContent: ViewStyle = {
  marginHorizontal: Spacing.large,
  backgroundColor: Colors.white,
  padding: Spacing.large,
  borderRadius: Spacing.mediumXL,
  borderWidth: Spacing.micro,
  borderColor: Colors.dark,
}
