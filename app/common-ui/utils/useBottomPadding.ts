import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

/**
 * @function useBottomPadding - React hook to add bottom padding to the content
 * it includes bottom TabBar offset and bottom safe area offset
 */
export const useBottomPadding = () => {
  const tabBarHeight = useBottomTabBarHeight()
  const { bottom } = useSafeAreaInsets()

  return tabBarHeight + bottom
}
