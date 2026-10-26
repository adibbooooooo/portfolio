/** Problem-solving stories — deeper than Projects; keep chat answers focused, link out for full read. */
export const caseStudyChunks = [
    {
        id: 'case-pr',
        topic: 'cases' as const,
        content: `Case study: PR Creator. Story site: https://case-pr.adibomar.com/ Product: https://pr.adibomar.com

Why I built it: Our PR descriptions were inconsistent and slowed reviews; context got lost for reviewers.

What was broken before: People pasted uneven bullets or skipped sections, so every PR looked different and hard to scan.

What I did: Built a Vue 3 PR builder with guided sections and AI Summarize that turns rough bullet notes into structured, paste-ready GitHub markdown.

Outcome: The team ships clearer PRs faster with a repeatable template.

What I would do differently: Mostly adapt as the team and tooling change (templates, review habits, model quality). I would tune sections and prompts based on how people actually write PRs.

Stack: Vue 3, AI agent integration, Markdown. For the full timeline and screenshots, read case-pr.adibomar.com.`,
    },
    {
        id: 'case-nft',
        topic: 'cases' as const,
        content: `Case study: NFT Images. Story site: https://case-nft.adibomar.com

Problem: The team spent too much time manually downloading and pixelating NFT images during drops.

What was broken before: One-by-one downloads and image edits created busywork and slowed drops.

What I did: Automated download and pixelation in a repeatable pipeline so assets batch-process instead of manual edits.

Outcome: The team worked more efficiently on NFT drops with less manual image handling.

What I would do differently: Adapt the pipeline as drop volume, formats, and tooling change. I would tighten steps based on what breaks in production.

Stack: Laravel, automation, image processing, Web3/NFT context. For the full write-up, read case-nft.adibomar.com.`,
    },
]
