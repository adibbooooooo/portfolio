/** Client-side error bubbles — must not be sent to the API as assistant history. */
export function isSyntheticErrorReply(content: string): boolean {
    const c = content.trim()
    if (!c) return true
    const prefixes = [
        'Sorry, my answer model',
        'Sorry, my answer model is misconfigured',
        'Sorry, I am having a small hiccup',
        'Sorry, I could not reach the server',
        'Sorry, I got an incomplete response',
        'Sorry, I could not answer that',
        'Sorry, I hit a small issue',
        'Sorry, I hit an issue:',
        'Sorry, something went wrong',
        'Hey, we have hit the question limit',
        'I am still being set up right now',
        'No answer returned.',
    ]
    return prefixes.some((p) => c.startsWith(p))
}
