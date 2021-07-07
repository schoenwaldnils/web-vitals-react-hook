import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCLS, getFCP, getFID, getLCP, getTTFB, Metric } from 'web-vitals'

const webVitals = {
  CLS: getCLS,
  FCP: getFCP,
  FID: getFID,
  LCP: getLCP,
  TTFB: getTTFB,
}

const MS_UNIT = 'ms'

const METRIC_CONFIG = new Map([
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

type MetricExtra = {
  rating?: string
  loading: boolean
  unit?: string
}

export type MetricPlus = Partial<Metric> & MetricExtra

export const useWebVitals = (
  vitals = ['CLS', 'FCP', 'FID', 'LCP', 'TTFB'],
): MetricPlus[] => {
  const [metrics, setMetrics] = useState<MetricPlus[]>([])

  const handleReport = useCallback((metric: Metric) => {
    let rating: string | undefined = undefined

    if (metric?.value) {
      rating = 'poor'
    }

    const metricConfig = METRIC_CONFIG.get(metric.name)

    if (!metricConfig) return

    const { good, needsImprovement } = metricConfig.thresholds

    if (
      metric?.value &&
      needsImprovement &&
      metric?.value <= needsImprovement
    ) {
      rating = 'needs-improvement'
    }

    if (metric?.value && metric?.value <= good) {
      rating = 'good'
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
          unit: metricConfig.unit,
        },
      ]
    })
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      vitals.forEach((vital) => {
        const getMetric = webVitals[vital as keyof typeof webVitals]

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
        },
    )
  }, [metrics, vitals])

  return sortetMetrics
}
