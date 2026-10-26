/** Critical static assets for first paint on `my.info` + shell. */

export const CRITICAL_IMAGE_URLS = [
    '/avatar.jpeg',
    '/about-picture.jpeg',
    '/avatar/avatar-1.jpg',
    '/avatar/avatar-2.jpg',
    '/avatar/avatar-3.jpg',
    '/avatar/avatar-june-siang.png',
    '/avatar/avatar-sudesh-wong.png',
    '/avatar/avatar-adibah-ariffin.png',
    '/avatar/avatar-jeffry-handani.png',
    '/pull-request-creator-poster.jpg',
    '/habo-gencards-poster.jpg',
    '/wedding-poster.jpg',
    '/habo-chain-poster.jpg',
    '/gym-poster.jpg',
    '/istp.png',
] as const

const BOOT_TIMEOUT_MS = 10_000
const MIN_BOOT_MS = 420

function preloadImage(url: string): Promise<void> {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = url
    })
}

function waitForFonts(): Promise<void> {
    if (!document.fonts?.ready) return Promise.resolve()
    return document.fonts.ready.then(() => undefined).catch(() => undefined)
}

export async function preloadCriticalAssets(onProgress?: (ratio: number) => void): Promise<void> {
    const started = performance.now()
    const urls = [...CRITICAL_IMAGE_URLS]
    const totalSteps = urls.length + 1
    let done = 0

    const tick = () => {
        done += 1
        onProgress?.(Math.min(1, done / totalSteps))
    }

    onProgress?.(0)

    await Promise.race([
        (async () => {
            await waitForFonts()
            tick()

            await Promise.all(
                urls.map(async (url) => {
                    await preloadImage(url)
                    tick()
                }),
            )
        })(),
        new Promise<void>((resolve) => setTimeout(resolve, BOOT_TIMEOUT_MS)),
    ])

    const elapsed = performance.now() - started
    if (elapsed < MIN_BOOT_MS) {
        await new Promise((r) => setTimeout(r, MIN_BOOT_MS - elapsed))
    }

    onProgress?.(1)
}
