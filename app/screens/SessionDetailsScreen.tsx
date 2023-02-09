import React, { FC } from "react"

import { HugeTitle, LargeTitle, MediumText, MediumTitle, RegularText } from "@common-ui/components/Text"
import { Spacing } from "@common-ui/constants/spacing"
import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabScreenProps } from "../navigators/MainNavigator"
import { observer } from "mobx-react-lite"
import { useStores } from "@models/index"
import { Card } from "@common-ui/components/Card"
import { BottomContainer, Row } from "@common-ui/components/Common"
import { SatisfactionStars } from "@components/PracticeItem"
import { Label } from "@common-ui/components/Label"
import { formatDateTime } from "@utils/formatDate"
import { LinkButton } from "@common-ui/components/Button"
import { Alert } from "react-native"

export const SessionDetailsScreen: FC<MainTabScreenProps<"SessionDetails">> = observer(
  function SessionDetailsScreen(props) {
    const { activitySessionId } = props.route.params
    const { practiceSessionStore } = useStores()

    const session = practiceSessionStore.getSessionById(activitySessionId)

    const deleteSession = () => {
      Alert.alert("Delete Session", "Are you sure you want to delete this session?", [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            practiceSessionStore.deleteSession(activitySessionId)
            props.navigation.goBack()
          }
        }
      ])
    }

    if (!session) {
      return null
    }

    const practiceTime = `${formatDateTime(session.startTime, "MMM dd, hh:mm a")} - ${formatDateTime(session.endTime, "MMM dd, hh:mm a")}`

    return (
      <Screen>
        <Row align="center">
          <MediumTitle>
            {practiceTime}
          </MediumTitle>
        </Row>
        <Content>
          <Card>
            <LargeTitle align="center" bottom={Spacing.medium}>
              Practice Time
            </LargeTitle>
            <HugeTitle align="center">
              {session.formattedDuration.hours}hr {session.formattedDuration.minutes}min
            </HugeTitle>
          </Card>          
          <MediumText top={Spacing.large} bottom={Spacing.small}>
            Rating
          </MediumText>
          <Row align="space-between">
            <Card flex>
              <MediumText align="center" bottom={Spacing.small}>
                Difficulty
              </MediumText>
              <LargeTitle align="center">
                {session.intencity} / 10
              </LargeTitle>
            </Card>
            <Card flex left={Spacing.medium}>
              <MediumText align="center" bottom={Spacing.small}>
                Fun
              </MediumText>
              <Row align="center">
                <SatisfactionStars satisfaction={session.satisfaction} />
              </Row>
            </Card>
          </Row>
          <MediumText top={Spacing.large} bottom={Spacing.small}>
            Categories
          </MediumText>
          <Row>
            {session.activities.map((activity, index) => (
              <Label
                key={index}
                text={activity.name}
                left={index !== 0 && Spacing.extraSmall}
                randomBgColor
              />
            ))}
          </Row>
          <MediumText top={Spacing.large} bottom={Spacing.small}>
            Comments
          </MediumText>
          <RegularText text={session.notes} />
          <BottomContainer>
            <LinkButton
              type="danger"
              title="Delete"
              onPress={deleteSession}
              bottom={Spacing.medium}
            />
          </BottomContainer>
        </Content>
      </Screen>
    )
  }
)
