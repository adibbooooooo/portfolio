/** GA4 measurement ID (must match index.html gtag config). */
export const GA_MEASUREMENT_ID = 'G-4DG7KF69MV'

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void
    }
}

/** Track a virtual page view (Vue Router navigation). */
export function trackPageView(path: string): void {
    if (typeof window.gtag !== 'function') return
    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
    })
}
