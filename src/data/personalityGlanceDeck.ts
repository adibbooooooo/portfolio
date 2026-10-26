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
        line: 'Capable teammates, clear ownership, focus on results. I unblock others and drive decisions.',
        icon: 'pi pi-users',
    },
    {
        id: 'impact',
        title: 'Impact',
        line: 'Deliver when plans are still forming. High quality bar and early risk flags.',
        icon: 'pi pi-chart-line',
    },
    {
        id: 'productivity',
        title: 'Execution',
        line: 'Move fast, adjust with facts. Autonomy and clear wins keep me engaged.',
        icon: 'pi pi-bolt',
    },
    {
        id: 'growth',
        title: 'Product & scale',
        line: 'Plans that ship for real. Solid design, steady delivery, habits that last.',
        icon: 'pi pi-chart-bar',
    },
    {
        id: 'working',
        title: 'Collaboration',
        line: 'Direct and prepared. Honest feedback and open discussion on ideas.',
        icon: 'pi pi-comments',
    },
]
