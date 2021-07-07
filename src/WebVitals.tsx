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
  hideFullName?: boolean
  className?: string
  NameComponent?: typeof Name
  ShortNameComponent?: typeof ShortName
  LinkComponent?: typeof Link
  ValueComponent?: typeof Value
}> = ({
  hideFullName = false,
  className = '',
  NameComponent = Name,
  ShortNameComponent = ShortName,
  LinkComponent = Link,
  ValueComponent = Value,
}) => {
  const metrics = useWebVitals()

  const dlStyles: CSSProperties = {
    display: 'inline-grid',
    columnGap: '1em',
    gridTemplateColumns: `repeat(${hideFullName ? 2 : 3}, auto)`,
  }

  return (
    <dl className={`${className} WebVitals`} style={dlStyles}>
      {metrics.map((metric) => {
        const { name, explainerURL, longName, rating, unit, value } = metric

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
              {value ? `${Math.floor(value)}${unit ? unit : ''}` : '...'}
            </ValueComponent>
          </Fragment>
        )
      })}
    </dl>
  )
}
