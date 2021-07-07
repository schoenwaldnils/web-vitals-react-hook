import React, { CSSProperties, FC } from 'react'

import { Rating, useWebVitals } from './useWebVitals'

export const WebVitals: FC<{ showMetricName?: boolean }> = ({
  showMetricName = false,
}) => {
  const metrics = useWebVitals()

  const dlStyles: CSSProperties = {
    display: 'inline-grid',
    columnGap: '1em',
    gridTemplateColumns: `repeat(${showMetricName ? 3 : 2}, auto)`,
  }

  return (
    <dl className="web-vitals" style={dlStyles}>
      {metrics.map((metric) => {
        const { name, explainerURL, longName, rating, unit, value } = metric

        let color = 'var(--metricPoor, red)'
        if (rating === Rating['needs-improvement']) {
          color = 'var(--metricNeedsImprovement, gold)'
        }
        if (rating === Rating['good']) {
          color = 'var(--metricGood, green)'
        }

        return (
          <>
            {showMetricName && <dt>{longName}</dt>}
            <dt>
              <a href={explainerURL} target="_blank">
                {showMetricName ? `(${name})` : name}
              </a>
            </dt>
            <dd style={{ color, margin: 0 }}>
              {value ? `${Math.floor(value)}${unit ? unit : ''}` : '...'}
            </dd>
          </>
        )
      })}
    </dl>
  )
}
