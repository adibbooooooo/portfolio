export type TextPart = {
    text: string
    highlight?: boolean
    delayIndex?: number
}

/** Split text into plain and highlighted parts; phrases must appear in order. */
export function splitWithHighlights(text: string, highlights: readonly string[]): TextPart[] {
    if (!highlights.length) return [{ text }]

    const parts: TextPart[] = []
    let remaining = text
    let delayIndex = 0

    for (const phrase of highlights) {
        if (!phrase) continue
        const idx = remaining.indexOf(phrase)
        if (idx === -1) continue

        if (idx > 0) parts.push({ text: remaining.slice(0, idx) })

        parts.push({ text: phrase, highlight: true, delayIndex: delayIndex++ })
        remaining = remaining.slice(idx + phrase.length)
    }

    if (remaining) parts.push({ text: remaining })
    return parts.length ? parts : [{ text }]
}
