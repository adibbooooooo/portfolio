/** Append a cache-busting param so portfolio iframe previews load the latest deploy. */
export function withPreviewCacheBust(url: string, nonce: number | string): string {
    try {
        const u = new URL(url)
        u.searchParams.set('_pv', String(nonce))
        return u.toString()
    } catch {
        const sep = url.includes('?') ? '&' : '?'
        return `${url}${sep}_pv=${encodeURIComponent(String(nonce))}`
    }
}
