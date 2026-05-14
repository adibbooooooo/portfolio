/** Stakeholder-facing copy for `my.fit` — synthesized from Crystal handbook themes. */

export type FitSection = {
    id: string
    title: string
    lead: string
    bullets: string[]
    /** PrimeIcons class, e.g. `pi pi-users` */
    icon: string
    /** Bento width: 2 = full row in 2-column grid */
    colSpan: 1 | 2
}

export const fitSections: FitSection[] = [
    {
        id: 'team',
        title: 'Team fit',
        lead: 'I work best when ownership is clear, the team is small and competent, and we are judged on outcomes rather than politics.',
        icon: 'pi pi-users',
        colSpan: 2,
        bullets: [
            'Fast pace with explicit deadlines; I think while moving and unblock others when momentum stalls.',
            'I prefer tight, skilled squads with clear roles over large consensus circles.',
            'I step in as the operator: clarify priorities, cut ambiguity, and push decisions through.',
            'I thrive where results beat process theatre; layered approvals and stakeholder sprawl drain me.',
        ],
    },
    {
        id: 'impact',
        title: 'Impact and results',
        lead: 'I optimize for achievement, visible impact, and leadership when the problem is hard and the path is unclear.',
        icon: 'pi pi-chart-line',
        colSpan: 1,
        bullets: [
            'Creative problem-solving under pressure; I turn messy reality into something shippable.',
            'Comfort deciding with incomplete information, then course-correcting with data.',
            'I hold the line on quality and accountability without micromanaging how every line is written.',
            'Honest, direct communication so issues surface early instead of festering.',
        ],
    },
    {
        id: 'productivity',
        title: 'Productivity',
        lead: 'My energy follows the work: owning a hard problem end-to-end charges me; bureaucracy and low-leverage rituals do the opposite.',
        icon: 'pi pi-bolt',
        colSpan: 1,
        bullets: [
            'Discovery: scan for momentum, concrete facts, and what already worked; impact is the first lens.',
            'Evaluation: structured trade-offs; logic and consequences lead, values act as a check.',
            'Commitment: commit quickly, expect to adjust, stay steady once the call is made.',
            'Charged by autonomy, measurable outcomes, and fixing broken systems; drained by long consensus meetings and being told how to do the work.',
        ],
    },
    {
        id: 'growth',
        title: 'Product and company growth',
        lead: 'I am wired for execution and product reality: strategy only matters when something reliable ships.',
        icon: 'pi pi-chart-bar',
        colSpan: 1,
        bullets: [
            'Turning strategy into working systems — migrations, architecture, delivery rhythm, and clear ownership.',
            'Product-minded engineering: trade-offs, risk, and what users actually experience.',
            'Scaling how the team works — standards, reviews, docs, and predictable releases — not heroics.',
            'Challenging the status quo when it blocks outcomes; I will say when something will not hold in production.',
        ],
    },
    {
        id: 'working',
        title: 'What it is like to work with me',
        lead: 'Direct, economical communication: I respect your time and expect clarity in return. I mean what I say in feedback.',
        icon: 'pi pi-comments',
        colSpan: 1,
        bullets: [
            'Come with data and a proposed path; I engage fastest when the problem is framed crisply.',
            'Meetings work when there is an agenda, a decision to make, and people who know their domain.',
            'Blind spots I watch for: my pace can outrun people who need more buy-in; I can underestimate how bluntness lands.',
            'Growth edge: bringing people with me — explaining the why so the team runs faster, not just harder.',
        ],
    },
]
