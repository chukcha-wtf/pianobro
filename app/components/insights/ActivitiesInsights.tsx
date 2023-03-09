import React from "react"

import { Card } from "@common-ui/components/Card"
import { Cell, Row } from "@common-ui/components/Common"
import { MediumText } from "@common-ui/components/Text"
import { Spacing } from "@common-ui/constants/spacing"
import { Label } from "@common-ui/components/Label"
import { TxKeyPath } from "@i18n/i18n"
import { translate } from "@i18n/translate"

type ActivitiesInsightsProps = {
  insights: string[]
}

export default function ActivitiesInsights(props: ActivitiesInsightsProps) {
  const { insights } = props

  if (!insights.length) return null

  return (
    <Card bottom={Spacing.medium}>
      <Row align="center" wrap>
        {insights.map((activity, index) => (
          <Label
            key={index}
            text={translate(`activity.${activity}` as TxKeyPath)}
            right={Spacing.extraSmall}
            bottom={Spacing.extraSmall}
            randomBgColor
          />
        ))}
      </Row>
      <Cell flex>
        <MediumText top={Spacing.small} align="center">
          {translate("insights.activitiesText")}
        </MediumText>
      </Cell>
    </Card>

  )
}