/** Recruiter skim: one headline + one line per tile. Detail lives in `my.handbook`. */

export type GlanceTile = {
    id: string
    title: string
    /** Single scannable line (~12–16 words max) */
    line: string
    icon: string
}

export const glanceTiles: GlanceTile[] = [
    {
        id: 'team',
        title: 'Team fit',
        line: 'Small skilled squads, clear ownership, outcomes over politics — I unblock and drive decisions.',
        icon: 'pi pi-users',
    },
    {
        id: 'impact',
        title: 'Impact',
        line: 'Ship under ambiguity; hold quality bar; say when something will not survive production.',
        icon: 'pi pi-chart-line',
    },
    {
        id: 'productivity',
        title: 'Execution',
        line: 'Fast commits, course-correct with data; autonomy and measurable wins energize me.',
        icon: 'pi pi-bolt',
    },
    {
        id: 'growth',
        title: 'Product & scale',
        line: 'Strategy matters when systems ship — architecture, delivery rhythm, standards that stick.',
        icon: 'pi pi-chart-bar',
    },
    {
        id: 'working',
        title: 'Collaboration',
        line: 'Direct, agenda-led meetings; feedback with receipts; I watch pace vs. buy-in.',
        icon: 'pi pi-comments',
    },
    {
        id: 'evidence',
        title: 'Evidence',
        line: 'Full Crystal handbook + ISTP cognitive export — assessments, career fit, blind spots.',
        icon: 'pi pi-book',
    },
]
