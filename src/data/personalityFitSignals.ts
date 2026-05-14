/** Compact assessment “widgets” for the `my.fit` signal strip (from Crystal handbook). */

export type FitSignalBadge = {
    kind: 'badge'
    id: string
    label: string
    value: string
    hint?: string
}

export type FitSignalBar = {
    kind: 'bar'
    id: string
    label: string
    /** 0–100 */
    percent: number
}

export type FitSignal = FitSignalBadge | FitSignalBar

export const fitSignals: FitSignal[] = [
    {
        kind: 'badge',
        id: 'mbti',
        label: '16Personalities',
        value: 'ISTP-T',
        hint: 'Virtuoso · assertive',
    },
    {
        kind: 'badge',
        id: 'disc',
        label: 'DISC',
        value: 'D · Captain',
        hint: 'Results, direct push',
    },
    {
        kind: 'badge',
        id: 'ennea',
        label: 'Enneagram',
        value: '8w7',
        hint: 'Maverick energy',
    },
    { kind: 'bar', id: 'es', label: 'Emotional stability (Big Five)', percent: 89 },
    { kind: 'bar', id: 'c', label: 'Conscientiousness', percent: 78 },
    { kind: 'bar', id: 'acc', label: 'Profile accuracy (Crystal)', percent: 60 },
]
