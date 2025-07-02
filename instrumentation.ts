export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation (jika diperlukan)
    // Untuk PostHog, kita hanya perlu client-side
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation (jika diperlukan)
  }
}