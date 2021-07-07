import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getCLS, getFCP, getFID, getLCP, getTTFB, Metric } from 'web-vitals'

const webVitals = {
  CLS: getCLS,
  FCP: getFCP,
  FID: getFID,
  LCP: getLCP,
  TTFB: getTTFB,
}

const MS_UNIT = 'ms'

type MetricConfig = {
  thresholds: {
    good: number
    needsImprovement?: number
  }
  observerEntryType?: string
  explainerURL: string
  longName: string
  unit?: typeof MS_UNIT
}

const METRIC_CONFIG: Map<string, MetricConfig> = new Map([
  [
    'CLS',
    {
      thresholds: {
        good: 0.1,
        needsImprovement: 0.25,
      },
      observerEntryType: 'layout-shift',
      explainerURL: 'https://web.dev/cls/',
      longName: 'Cumulative Layout Shift',
    },
  ],
  [
    'FCP',
    {
      thresholds: {
        good: 2500,
      },
      observerEntryType: 'paint',
      explainerURL: 'https://web.dev/fcp/',
      unit: MS_UNIT,
      longName: 'First Contentful Paint',
    },
  ],
  [
    'FID',
    {
      thresholds: {
        good: 100,
        needsImprovement: 300,
      },
      observerEntryType: 'first-input',
      explainerURL: 'https://web.dev/fid/',
      unit: MS_UNIT,
      longName: 'First Input Delay',
    },
  ],
  [
    'LCP',
    {
      thresholds: {
        good: 2500,
        needsImprovement: 4000,
      },
      observerEntryType: 'paint',
      explainerURL: 'https://web.dev/lcp/',
      unit: MS_UNIT,
      longName: 'Largest Contentful Paint',
    },
  ],
  [
    'TTFB',
    {
      thresholds: {
        good: 2500,
      },
      explainerURL: 'https://web.dev/time-to-first-byte/',
      unit: MS_UNIT,
      longName: 'Time to first byte',
    },
  ],
])

export enum Rating {
  'poor',
  'needs-improvement',
  'good',
}

type MetricExtra = {
  rating?: Rating
  loading: boolean
  supported: boolean
  unit?: string
}

export type MetricPlus = Partial<Metric> & Partial<MetricConfig> & MetricExtra

export const useWebVitals = (
  vitals = ['CLS', 'FCP', 'FID', 'LCP', 'TTFB'],
): MetricPlus[] => {
  const [metrics, setMetrics] = useState<MetricPlus[]>([])
  const unsopprted = useRef<string[]>([])

  const handleReport = useCallback((metric: Metric) => {
    let rating: Rating

    if (metric?.value) {
      rating = Rating['poor']
    }

    const metricConfig = METRIC_CONFIG.get(metric.name)

    if (!metricConfig) return

    const { good, needsImprovement } = metricConfig.thresholds

    if (
      metric?.value &&
      needsImprovement &&
      metric?.value <= needsImprovement
    ) {
      rating = Rating['needs-improvement']
    }

    if (metric?.value && metric?.value <= good) {
      rating = Rating['good']
    }

    setMetrics((curr) => {
      if (curr.find((i) => i.name === metric.name) || !metric?.value) {
        return curr
      }
      return [
        ...curr,
        {
          ...metric,
          rating,
          loading: false,
          supported: true,
          unit: metricConfig.unit,
          ...metricConfig,
        },
      ]
    })
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      vitals.forEach((vital) => {
        const getMetric = webVitals[vital as keyof typeof webVitals]

        // exclude metric when it's not supported
        const metricConfig = METRIC_CONFIG.get(vital)

        if (
          metricConfig?.observerEntryType &&
          !PerformanceObserver.supportedEntryTypes.includes(
            metricConfig?.observerEntryType,
          )
        ) {
          console.error(
            `${
              METRIC_CONFIG.get(vital)?.longName || vital
            } not supported in this browser`,
          )
          if (unsopprted.current.indexOf(vital) === -1) {
            unsopprted.current.push(vital)
          }
          return
        }

        if (getMetric) {
          getMetric(handleReport)
        } else {
          console.error(
            `${
              METRIC_CONFIG.get(vital)?.longName || vital
            } not supported in this browser`,
          )
        }
      })
    }
  }, [handleReport, vitals])

  const sortetMetrics: MetricPlus[] = useMemo(() => {
    return vitals.map(
      (v) =>
        metrics.find((m) => m.name === (v as Metric['name'])) || {
          name: v as Metric['name'],
          loading: true,
          supported: !unsopprted.current.includes(v),
          ...METRIC_CONFIG.get(v),
        },
    )
  }, [metrics, vitals])

  return sortetMetrics
}
