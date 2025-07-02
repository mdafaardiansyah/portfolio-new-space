'use client'

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { usePostHog } from 'posthog-js/react'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // PostHog sudah diinisialisasi di instrumentation-client.ts
    // Hanya perlu memastikan konfigurasi tambahan jika diperlukan
    if (typeof window !== 'undefined' && !posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
        capture_exceptions: true,
        defaults: '2025-05-24',
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug()
            console.log('✅ PostHog initialized via provider fallback')
          }
        }
      })
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      
      posthog.capture('$pageview', {
        $current_url: url,
      })
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 PostHog pageview captured:', url)
      }
    }
  }, [pathname, searchParams, posthog])

  return null
}