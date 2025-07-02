# PostHog Implementation Guide

## Overview
PostHog telah diintegrasikan ke dalam portfolio ini menggunakan best practices untuk Next.js 15.3+. Implementasi ini mencakup analytics, event tracking, dan session recording.

## Setup dan Konfigurasi

### 1. Environment Variables
File `.env` sudah dikonfigurasi dengan:
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_2X0z7r7nBEbNaktAF7Uk2DYBIg78qdbmetnbEnBLUcN
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### 2. Dependencies
Package yang digunakan:
- `posthog-js`: ^1.246.0 (client-side tracking)
- `posthog-node`: ^4.17.2 (server-side tracking)

### 3. Reverse Proxy Setup
File `next.config.ts` sudah dikonfigurasi dengan reverse proxy untuk menghindari ad blockers:
```typescript
async rewrites() {
  return [
    {
      source: "/ingest/static/:path*",
      destination: "https://us-assets.i.posthog.com/static/:path*",
    },
    {
      source: "/ingest/:path*",
      destination: "https://us.i.posthog.com/:path*",
    },
    {
      source: "/ingest/decide",
      destination: "https://us.i.posthog.com/decide",
    },
  ];
}
```

## Implementation Methods

### Method 1: Instrumentation Client (Recommended untuk Next.js 15.3+)
File `instrumentation-client.ts` di root directory:
```typescript
import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  person_profiles: 'identified_only',
  capture_pageview: true,
  capture_pageleave: true,
  capture_exceptions: true,
  debug: process.env.NODE_ENV === 'development',
});
```

### Method 2: Provider Pattern (Fallback)
File `src/components/posthogprovider.tsx` untuk kompatibilitas:
```typescript
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false, // Manual pageview tracking
      capture_pageleave: true,
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
    })
  }, [])
  // ...
}
```

## Event Tracking Examples

### 1. Social Media Links (HeroSection)
```typescript
posthog.capture('social_link_clicked', {
  platform: link.label,
  url: link.href,
  section: 'hero'
});
```

### 2. Contact Form Tracking (ContactSection)
```typescript
// Form submission attempt
posthog.capture('contact_form_submitted', {
  form_data: {
    has_name: !!formData.name,
    has_email: !!formData.email,
    message_length: formData.message.length
  },
  timestamp: new Date().toISOString()
});

// Success tracking
posthog.capture('contact_form_success', {
  email_service: 'emailjs',
  result_status: result.status,
  timestamp: new Date().toISOString()
});

// Error tracking
posthog.capture('contact_form_error', {
  error_message: error instanceof Error ? error.message : 'Unknown error',
  timestamp: new Date().toISOString()
});
```

### 3. Navigation Tracking
```typescript
posthog.capture('availability_status_clicked', {
  action: 'navigate_to_contact',
  section: 'hero'
});
```

## Features yang Aktif

### Automatic Tracking
- ✅ **Pageviews**: Otomatis melacak kunjungan halaman
- ✅ **Page Leave**: Melacak ketika user meninggalkan halaman
- ✅ **Exceptions**: Melacak error JavaScript
- ✅ **Session Recording**: Merekam sesi pengguna (jika diaktifkan)

### Manual Event Tracking
- ✅ **Social Media Clicks**: Tracking klik pada link sosial media
- ✅ **Contact Form**: Tracking submission, success, dan error
- ✅ **Navigation**: Tracking interaksi navigasi

### Development Features
- ✅ **Debug Mode**: Aktif di development environment
- ✅ **Console Logging**: Log PostHog events di development

## Best Practices yang Diimplementasikan

1. **Privacy-First**: `person_profiles: 'identified_only'` - hanya membuat profil untuk user yang teridentifikasi
2. **Performance**: Menggunakan reverse proxy untuk menghindari blocking
3. **Error Handling**: Comprehensive error tracking untuk debugging
4. **Development Experience**: Debug mode dan logging untuk development
5. **Security**: Environment variables untuk API keys

## Cara Menambahkan Event Tracking Baru

1. Import posthog di komponen:
```typescript
import posthog from "posthog-js";
```

2. Tambahkan event tracking:
```typescript
const handleClick = () => {
  posthog.capture('custom_event_name', {
    property1: 'value1',
    property2: 'value2',
    timestamp: new Date().toISOString()
  });
};
```

## Monitoring dan Analytics

Untuk melihat data analytics:
1. Login ke PostHog dashboard: https://us.i.posthog.com
2. Gunakan API key yang sama untuk akses
3. Monitor events, funnels, dan user behavior

## Troubleshooting

### Jika Events Tidak Muncul:
1. Periksa console browser untuk error
2. Pastikan environment variables sudah benar
3. Cek network tab untuk request ke `/ingest`
4. Verifikasi PostHog key dan host

### Development vs Production:
- Development: Debug mode aktif, console logging
- Production: Optimized tracking, no debug logs

## Server-Side Tracking (Optional)

Untuk server-side events, gunakan `lib/posthog.ts`:
```typescript
import PostHogClient from '@/lib/posthog'

const posthog = PostHogClient()
posthog.capture({
  distinctId: 'user-id',
  event: 'server_event',
  properties: { key: 'value' }
})
```

Implementasi ini mengikuti dokumentasi resmi PostHog dan best practices untuk Next.js applications.