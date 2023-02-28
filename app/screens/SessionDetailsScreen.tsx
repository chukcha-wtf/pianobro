import React, { FC } from "react"
import { Alert } from "react-native"
import { observer } from "mobx-react-lite"

import { HugeTitle, LargeTitle, MediumText, RegularText } from "@common-ui/components/Text"
import { Spacing } from "@common-ui/constants/spacing"
import { Content, Screen } from "@common-ui/components/Screen"

import { MainTabScreenProps } from "../navigators/MainNavigator"
import { useStores } from "@models/index"
import { Card } from "@common-ui/components/Card"
import { AbsoluteContainer, BottomContainer, Row } from "@common-ui/components/Common"
import { SatisfactionStars } from "@components/PracticeItem"
import { Label } from "@common-ui/components/Label"
import { LinkButton } from "@common-ui/components/Button"
import { Colors } from "@common-ui/constants/colors"
import { formatDateRangeText } from "@utils/formatDateRangeText"
import { If } from "@common-ui/components/Conditional"

export const SessionDetailsScreen: FC<MainTabScreenProps<"SessionDetails">> = observer(
  function SessionDetailsScreen(props) {
    const { activitySessionId } = props.route.params
    const { practiceSessionStore, removeSession } = useStores()

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
            removeSession(activitySessionId)
            props.navigation.goBack()
          }
        }
      ])
    }

    if (!session) {
      return null
    }

    const practiceTime = formatDateRangeText(session.startTime, session.endTime, "week")

    return (
      <Screen edges={["bottom"]} bgColor={Colors.grayBackground}>
        <Row align="center" top={Spacing.large} bottom={Spacing.extraSmall}>
          <MediumText>
            {practiceTime}
          </MediumText>
          <AbsoluteContainer sticks={['right']}>
            <LinkButton
              icon="chevron-down"
              iconSize={Spacing.larger}
              textColor={Colors.dark}
              onPress={props.navigation.goBack}
              innerRight={Spacing.small}
            />
          </AbsoluteContainer>
        </Row>
        <Content bgColor={Colors.grayBackground}>
          <Card>
            <LargeTitle align="center" bottom={Spacing.medium}>
              Practice Time
            </LargeTitle>
            <HugeTitle align="center" color={Colors.primary}>
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
                <SatisfactionStars satisfaction={session.satisfaction} size={Spacing.mediumXL} />
              </Row>
            </Card>
          </Row>
          <If condition={!!session.activities?.length}>
            <MediumText top={Spacing.large} bottom={Spacing.small}>
              Categories
            </MediumText>
            <Row wrap>
              {session.activities.map((activity, index) => (
                <Label
                  key={index}
                  text={activity.name}
                  right={Spacing.extraSmall}
                  bottom={Spacing.extraSmall}
                  randomBgColor
                />
              ))}
            </Row>
          </If>
          <If condition={!!session.notes}>
            <MediumText top={Spacing.large} bottom={Spacing.small}>
              Comments
            </MediumText>
            <RegularText text={session.notes} />
          </If>
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
