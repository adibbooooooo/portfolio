/** Escape HTML before injecting link markup. */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

/**
 * Turn URLs and emails in plain text into safe <a> tags (target="_blank").
 * Supports https://, www., bare domains (cal.com/...), and work@domain.com.
 */
export function linkifyMessageHtml(text: string): string {
    const escaped = escapeHtml(text)

    const pattern =
        /(?:\bhttps?:\/\/[^\s<>"']+)|(?:\bwww\.[^\s<>"']+)|(?:\b[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z]{2,})+(?:\/[^\s<>"']*)?)|(?:\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b)/gi

    return escaped.replace(pattern, (match) => {
        const trimmed = match.replace(/[.,;:!?)]+$/, '')
        const trailing = match.slice(trimmed.length)
        const href = toHref(trimmed)
        const cls = 'ask-link underline decoration-emerald-400/50 underline-offset-2 hover:text-emerald-200'
        return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="${cls}">${escapeHtml(trimmed)}</a>${escapeHtml(trailing)}`
    })
}

function toHref(match: string): string {
    if (/^https?:\/\//i.test(match)) return match
    if (/^www\./i.test(match)) return `https://${match}`
    if (match.includes('@')) return `mailto:${match}`
    return `https://${match}`
}

/** Break comma-separated "Name at https://..." into line bullets before linkify. */
export function formatListFriendlyText(text: string): string {
    const urlCount = (text.match(/https?:\/\//g) ?? []).length
    let t = text.replace(/\s+at\s+(https?:\/\/)/gi, ' - $1')

    if (urlCount >= 2) {
        // New bullet after each URL (comma-separated project lists).
        t = t.replace(/(https?:\/\/[^\s,]+),\s+/g, '$1\n• ')
    }

    return t
}

/** Linkify + line breaks + simple bullet rows for assistant messages. */
export function formatAssistantMessageHtml(text: string): string {
    const formatted = formatListFriendlyText(text)
    const lines = formatted.split('\n')
    const parts: string[] = []

    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        if (trimmed.startsWith('•')) {
            const body = linkifyMessageHtml(trimmed.replace(/^•\s*/, ''))
            parts.push(`<div class="ask-list-item">${body}</div>`)
        } else {
            parts.push(`<div class="ask-list-line">${linkifyMessageHtml(trimmed)}</div>`)
        }
    }

    return parts.length > 0 ? parts.join('') : linkifyMessageHtml(text)
}
