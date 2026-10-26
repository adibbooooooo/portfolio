/** Client fallback when API omits suggestContact (older deploy). */
export function inferSuggestContact(question: string, answer: string): boolean {
    const q = question.toLowerCase()
    const phrases = [
        'know more',
        'learn more',
        'more detail',
        'tell me more',
        'walkthrough',
        'contact',
        'reach you',
        'email you',
        'get in touch',
        'hire',
        'collaborat',
        'meeting',
        'schedule',
        'work with you',
        'open for collaboration',
    ]
    if (phrases.some((p) => q.includes(p))) return true

    const a = answer.toLowerCase()
    if (a.includes('work@adibomar.com') || a.includes('cal.com/adibomar')) return true
    return /\b(contact me|reach out|open for collaboration|book a call|get in touch)\b/i.test(answer)
}
