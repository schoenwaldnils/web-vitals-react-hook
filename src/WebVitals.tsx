import React, { CSSProperties, FC, Fragment } from 'react'

import { Rating, useWebVitals } from './useWebVitals'

export const Name: FC<React.HTMLAttributes<HTMLElement>> = (props) => (
  <dt {...props} />
)

export const ShortName = Name

export const Link: FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (
  props,
) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a {...props} />
)

export const Value: FC<React.HTMLAttributes<HTMLElement>> = (props) => (
  <dd {...props} />
)

export const WebVitals: FC<{
  vitals?: string[]
  hideFullName?: boolean
  className?: string
  NameComponent?: typeof Name
  ShortNameComponent?: typeof ShortName
  LinkComponent?: typeof Link
  ValueComponent?: typeof Value
}> = ({
  vitals = ['CLS', 'FCP', 'FID', 'LCP', 'TTFB'],
  hideFullName = false,
  className = '',
  NameComponent = Name,
  ShortNameComponent = ShortName,
  LinkComponent = Link,
  ValueComponent = Value,
}) => {
  const metrics = useWebVitals(vitals)

  const dlStyles: CSSProperties = {
    display: 'inline-grid',
    columnGap: '1em',
    gridTemplateColumns: `repeat(${hideFullName ? 2 : 3}, auto)`,
  }

  return (
    <dl className={`${className} WebVitals`} style={dlStyles}>
      {metrics.map((metric) => {
        const { name, explainerURL, longName, supported, rating, unit, value } =
          metric

        let color = 'var(--metricUnknown, inherit)'
        if (rating === Rating['poor']) {
          color = 'var(--metricPoor, red)'
        }
        if (rating === Rating['needs-improvement']) {
          color = 'var(--metricNeedsImprovement, gold)'
        }
        if (rating === Rating['good']) {
          color = 'var(--metricGood, green)'
        }

        const Link = () => (
          <LinkComponent
            href={explainerURL}
            target="_blank"
            className="WebVitals-link"
          >
            {name}
          </LinkComponent>
        )

        let valueString = '...'

        if (!supported) {
          valueString = 'not supported'
        }

        if (supported && value) {
          if (unit === 'ms') {
            valueString = `${Math.floor(value)}${unit}`
          } else {
            valueString = value.toFixed(2)
          }
        }

        return (
          <Fragment key={metric.name}>
            {!hideFullName && (
              <NameComponent className="WebVitals-name">
                {longName}
              </NameComponent>
            )}
            <ShortNameComponent className="WebVitals-shortName">
              {hideFullName ? (
                <Link />
              ) : (
                <>
                  (<Link />)
                </>
              )}
            </ShortNameComponent>
            <ValueComponent
              style={{ color, margin: 0 }}
              className="WebVitals-value"
            >
              {valueString}
            </ValueComponent>
          </Fragment>
        )
      })}
    </dl>
  )
}
