import React from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigationHelpers, ParamListBase, TabNavigationState } from "@react-navigation/native"


import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { HomeScreen, StatisticsScreen, ProfileScreen } from "../screens"
import { Colors, Palette } from "@common-ui/constants/colors"
import { Spacing } from "@common-ui/constants/spacing"
import Icon from "@common-ui/components/Icon"
import { BottomTabDescriptorMap, BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs/lib/typescript/src/types"
import { Feather } from "@expo/vector-icons"

export type MainTabParamList = {
  Home: undefined
  Statistics: undefined
  Profile: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

type FloatingTabBarProps = {
  state: TabNavigationState<ParamListBase>
  descriptors: BottomTabDescriptorMap
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>
}

const Tab = createBottomTabNavigator<MainTabParamList>()

const ICONS_MAP = {
  Home: "home",
  Statistics: "activity",
  Profile: "user",
}

function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={[$tabBarHolder, { marginBottom: bottom ?? Spacing.large }]}>
      <View style={$floatingTabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true, params: {} })
            }
          }

          const iconColor = isFocused ? Palette.black : Palette.black300

          // TODO: figure out why icon color isn't changing
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={route.name}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={$floatingTabBarItem}
            >
              <Icon size={Spacing.large} name={ICONS_MAP[route.name]} color={iconColor} />
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

const $tabBarHolder: ViewStyle = {
  position: "absolute",
  backgroundColor: Colors.transparent,
  bottom: 0,
  left: 0,
  right: 0,
}

const $floatingTabBar: ViewStyle = {
  height: 70,
  flexDirection: "row",
  marginHorizontal: Spacing.large,
  borderWidth: 2,
  borderRadius: 30,
  borderColor: Colors.dark,
  backgroundColor: Colors.tabBackground,
}

const $floatingTabBarItem: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
}
