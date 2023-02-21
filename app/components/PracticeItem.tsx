import React from "react"

import { StarFilled } from "@common-ui/components/Icon"
import { Spacing } from "@common-ui/constants/spacing"
import { PracticeSession } from "@models/PracticeSession"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { MainTabParamList } from "@navigators/MainNavigator"
import { ROUTES } from "@navigators/AppNavigator"
import { Card } from "@common-ui/components/Card"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Cell, Row } from "@common-ui/components/Common"
import { LabelText, LargeTitle, RegularText } from "@common-ui/components/Text"
import { formatTime } from "@utils/formatDate"
import { If } from "@common-ui/components/Conditional"
import { FLASH_LIST_OFFSET } from "@screens/ActivityDetailsScreen"

export function SatisfactionStars({ satisfaction, size }: { satisfaction: number, size?: number }) {
  const satisfactionStars = Array.from({ length: satisfaction }, (_, i) => i)

  return (
    <>
      {satisfactionStars.map((_, i) => (
        <Cell key={i} right={Spacing.tiny}>
          <StarFilled size={size ?? Spacing.small} />
        </Cell>
      ))}
    </>
  )
}

export const PRACTICE_ITEM_HEIGHT = 116

export const PracticeItem = function PracticeItem({ item }: { item: PracticeSession }) {
  const navigation = useNavigation<NavigationProp<MainTabParamList>>()

  const showDetails = () => {
    navigation.navigate(ROUTES.SessionDetails, { activitySessionId: item.uuid })
  }

  let activitiesText = ""

  if (item.activities.length) {
    const firstActivities = item.activities.slice(0, 2)
    const remainingActivities = item.activities.slice(2)
    
    activitiesText = firstActivities.map((activity) => activity?.name).join(", ")
  
    if (remainingActivities.length > 1) {
      activitiesText += ` + ${remainingActivities.length} others`
    }
    else if (remainingActivities.length === 1) {
      activitiesText += `, ${remainingActivities[0]?.name}`
    }
  }

  return (
    <Card
      key={item.uuid}
      bottom={Spacing.medium}
      right={FLASH_LIST_OFFSET}
    >
      <TouchableOpacity onPress={showDetails}>
        <Cell>
          <If condition={!!item.satisfaction}>
            <Row bottom={Spacing.extraSmall}>
              <SatisfactionStars satisfaction={item.satisfaction} />
            </Row>
          </If>
          <LargeTitle>
            {item.formattedDuration.hours}:{item.formattedDuration.minutes}
            <RegularText>
              {"  "}{formatTime(item.startTime)}-{formatTime(item.endTime)}
            </RegularText>
          </LargeTitle>
        </Cell>
        <If condition={!!item.activities.length}>
          <Row top={Spacing.extraSmall}>
            <LabelText text={activitiesText} />
          </Row>
        </If>
      </TouchableOpacity>
    </Card>
  )
}