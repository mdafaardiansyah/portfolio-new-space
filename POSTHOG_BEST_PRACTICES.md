# PostHog Integration - Best Practices Implementation

Implementasi ini mengikuti best practices resmi PostHog untuk Next.js 15.3+ dengan App Router.

## Struktur File

### 1. `instrumentation-client.ts` (Root)
- **Tujuan**: Inisialisasi PostHog yang ringan dan cepat
- **Kapan dimuat**: Otomatis oleh Next.js 15.3+ saat aplikasi dimuat
- **Konfigurasi**:
  - `person_profiles: 'identified_only'` - Hanya buat profil untuk pengguna yang teridentifikasi
  - `capture_pageview: false` - Matikan pageview otomatis, kita tangani manual
  - `capture_pageleave: true` - Aktifkan tracking saat pengguna meninggalkan halaman
  - `capture_exceptions: true` - Aktifkan tracking error otomatis
  - `defaults: '2025-05-24'` - Versi feature flags

### 2. `instrumentation.ts` (Root)
- **Tujuan**: Memastikan instrumentation-client.ts dimuat dengan benar
- **Required**: Untuk Next.js 15.3+ instrumentation

### 3. `src/components/posthogprovider.tsx`
- **Tujuan**: Provider React untuk PostHog dengan fallback initialization
- **Fitur**:
  - Fallback initialization jika instrumentation-client gagal
  - Manual pageview tracking
  - Debug logging untuk development

## Environment Variables

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_2X0z7r7nBEbNaktAF7Uk2DYBIg78qdbmetnbEnBLUcN
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Keuntungan Implementasi Ini

1. **Performance**: Instrumentation-client.ts dimuat lebih awal dan ringan
2. **Reliability**: Fallback mechanism di provider
3. **Best Practices**: Mengikuti dokumentasi resmi PostHog
4. **Clean Code**: Tidak perlu reverse proxy atau konfigurasi kompleks
5. **Debug Friendly**: Logging yang jelas untuk development

## Manual Event Tracking

Untuk mengirim event manual:

```typescript
import { usePostHog } from 'posthog-js/react'

function MyComponent() {
  const posthog = usePostHog()
  
  const handleClick = () => {
    posthog?.capture('button_clicked', {
      button_name: 'hero_cta',
      page: 'home'
    })
  }
  
  return <button onClick={handleClick}>Click me</button>
}
```

## Troubleshooting

1. **PostHog tidak load**: Periksa console untuk error dari instrumentation-client
2. **Events tidak terkirim**: Pastikan NEXT_PUBLIC_POSTHOG_KEY benar
3. **Development debugging**: PostHog debug mode aktif otomatis di development

## Migration dari Setup Lama

✅ **Dihapus**:
- Custom usePostHog hook
- Reverse proxy configuration di next.config.ts
- Network testing logic
- Complex error handling

✅ **Ditambahkan**:
- instrumentation-client.ts
- instrumentation.ts
- Simplified PostHogProvider
- Direct PostHog host configuration