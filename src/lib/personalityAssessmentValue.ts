export type AssessmentValueSegment = { kind: 'text' | 'up' | 'down'; text: string }

/** Parses Crystal-style Big Five arrows in assessment value strings. */
export function parseAssessmentValueSegments(value: string): AssessmentValueSegment[] {
    const parts: AssessmentValueSegment[] = []
    const re = /(↑|↓)/g
    let last = 0
    let match: RegExpExecArray | null
    while ((match = re.exec(value)) !== null) {
        if (match.index > last) parts.push({ kind: 'text', text: value.slice(last, match.index) })
        const arrow = match[1] ?? ''
        parts.push({ kind: arrow === '↑' ? 'up' : 'down', text: arrow })
        last = match.index + match[0].length
    }
    if (last < value.length) parts.push({ kind: 'text', text: value.slice(last) })
    if (parts.length === 0) parts.push({ kind: 'text', text: value })
    return parts
}
