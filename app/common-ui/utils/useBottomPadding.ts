import { TABBAR_HEIGHT } from "@navigators/MainNavigator"
import { useSafeAreaInsets } from "react-native-safe-area-context"

/**
 * @function useBottomPadding - React hook to add bottom padding to the content
 * it includes bottom TabBar offset and bottom safe area offset
 */
export const useBottomPadding = () => {
  const { bottom } = useSafeAreaInsets()

  return TABBAR_HEIGHT + bottom
}
