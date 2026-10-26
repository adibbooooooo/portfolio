const DEFAULT_VIEWPORT = 'width=device-width, initial-scale=1.0'
const LOCKED_VIEWPORT = 'width=device-width, initial-scale=1.0, maximum-scale=1.0'

let viewportMeta: HTMLMetaElement | null = null
let previousViewport = ''
let lockCount = 0

/** iPhone / iPad Safari auto-zooms inputs below 16px; lock viewport as fallback. */
export function isLikelyIOS(): boolean {
    if (typeof navigator === 'undefined') return false
    return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    )
}

export function lockViewportZoom(): void {
    if (!isLikelyIOS()) return

    lockCount += 1
    if (lockCount > 1) return

    viewportMeta = document.querySelector('meta[name="viewport"]')
    if (!viewportMeta) return

    previousViewport = viewportMeta.getAttribute('content') ?? DEFAULT_VIEWPORT
    if (!/maximum-scale\s*=\s*1/i.test(previousViewport)) {
        viewportMeta.setAttribute('content', LOCKED_VIEWPORT)
    }
}

export function unlockViewportZoom(): void {
    if (!isLikelyIOS()) return

    lockCount = Math.max(0, lockCount - 1)
    if (lockCount > 0 || !viewportMeta) return

    viewportMeta.setAttribute('content', previousViewport || DEFAULT_VIEWPORT)
    viewportMeta = null
    previousViewport = ''
}

export function scrollInputIntoView(el: HTMLElement | null): void {
    if (!el) return
    requestAnimationFrame(() => {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    })
}
