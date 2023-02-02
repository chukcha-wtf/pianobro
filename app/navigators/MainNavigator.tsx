import React from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"

import { createStackNavigator } from "@react-navigation/stack"
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BottomTabDescriptorMap, BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs/lib/typescript/src/types"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigationHelpers, ParamListBase, TabNavigationState } from "@react-navigation/native"


import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { HomeScreen, StatisticsScreen, ProfileScreen } from "../screens"
import { Colors, Palette } from "@common-ui/constants/colors"
import { Spacing } from "@common-ui/constants/spacing"
import Icon from "@common-ui/components/Icon"
import { SessionDetailsScreen } from "@screens/SessionDetailsScreen"
import { ActivityDetailsScreen } from "@screens/ActivityDetailsScreen"


type TabParamList = {
  HomeStack: undefined
  StatisticsStack: undefined
  Profile: undefined
}

type StatisticsStackParamList = {
  Statistics: undefined
  ActivityDetails: { activityId: string }
  SessionDetails: { activitySessionId: string }
}

type HomeStackParamList = {
  Home: undefined
  SessionDetails: { activitySessionId: string }
}

export type MainTabParamList = TabParamList & StatisticsStackParamList & HomeStackParamList

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

const HomeStack = createNativeStackNavigator<HomeStackParamList>()
const StatisticsStack = createNativeStackNavigator<StatisticsStackParamList>()

const Tab = createBottomTabNavigator<MainTabParamList>()

export enum ROUTES {
  Home = "Home",
  Statistics = "Statistics",
  Profile = "Profile",
  SessionDetails = "SessionDetails",
  ActivityDetails = "ActivityDetails",
}


const TABBAR_HEIGHT = 70

function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={[$tabBarHolder, { paddingBottom: bottom ?? Spacing.large }]}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0)']}
        style={$linearBackground}
        locations={[0, 0.3, 0.5, 0.8, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      />
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

function HomeNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={ROUTES.Home}
    >
      <HomeStack.Screen name={ROUTES.Home} component={HomeScreen} />
      <HomeStack.Screen
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
        name={ROUTES.SessionDetails}
        component={SessionDetailsScreen} />
    </HomeStack.Navigator>
  )
}

function StatsticsNavigator() {
  return (
    <StatisticsStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "left",
      }}
      initialRouteName={ROUTES.Statistics}
    >
      <StatisticsStack.Screen
        name={ROUTES.Statistics}
        component={StatisticsScreen} />
      <StatisticsStack.Screen
        name={ROUTES.ActivityDetails}
        component={ActivityDetailsScreen} />
      <StatisticsStack.Screen
        options={{
          presentation: 'modal',
        }}
        name={ROUTES.SessionDetails}
        component={SessionDetailsScreen} />
    </StatisticsStack.Navigator>
  )
}

// Icons map for tabbar
const ICONS_MAP = {
  HomeStack: "home",
  StatisticsStack: "activity",
  Profile: "user",
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
      <Tab.Screen name="HomeStack" component={HomeNavigator} />
      <Tab.Screen name="StatisticsStack" component={StatsticsNavigator} />
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
  height: TABBAR_HEIGHT,
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

const $linearBackground: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}
