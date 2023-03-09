import React from "react"
import { translate } from "@i18n/translate"

import { Card } from "@common-ui/components/Card"
import { Cell, Row } from "@common-ui/components/Common"
import { HugeTitle, MediumText } from "@common-ui/components/Text"
import { Spacing } from "@common-ui/constants/spacing"
import { DurationObject } from "@utils/formatDate"
import { DynamicsOptions } from "@models/Statistics"

type TimeInsightsProps = {
  insights: [DurationObject, DurationObject, DynamicsOptions.increase | DynamicsOptions.decrease]
}

export default function PracticeTimeInsights(props: TimeInsightsProps) {
  const { insights } = props
  const [lastWeekTimeDuration, _weekAgoTimeDuration, timeDynamics] = insights

  const prefix = timeDynamics === DynamicsOptions.increase ?
    translate("insights.prefixAn") :
    translate("insights.prefixThe")
  const dynamics = timeDynamics === DynamicsOptions.increase ?
    translate("insights.dynamicsIncrease") :
    translate("insights.dynamicsDecrease")

  return (
    <Card bottom={Spacing.medium}>
      <Row wrap>
        <Cell flex>
          <MediumText muted bottom={Spacing.small}>
            {translate("insights.timePracticedText")}
          </MediumText>
          <MediumText muted>
            {translate("insights.timePracticedSubText", { context: `${prefix} ${dynamics}` })}
          </MediumText>
        </Cell>
        <Cell left={Spacing.small}>
          <HugeTitle align="center">
            🎶 {lastWeekTimeDuration.hours}{translate("common.hr")}
          </HugeTitle>
        </Cell>
      </Row>
    </Card>
  )
}
