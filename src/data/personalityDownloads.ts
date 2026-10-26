export type PersonalityDownload = {
    id: string
    label: string
    description: string
    href: string
    filename: string
}

export const personalityDownloads: PersonalityDownload[] = [
    {
        id: 'crystal-handbook',
        label: 'Crystal handbook',
        description: 'Full personality handbook export from Crystal Knows.',
        href: '/Your_Personality_Handbook_Crystal.pdf',
        filename: 'Your_Personality_Handbook_Crystal.pdf',
    },
    {
        id: 'istp-guide',
        label: 'ISTP cognitive guide',
        description: 'ISTP type reference and cognitive function notes.',
        href: '/ISTP_Weapons_Specialist.pdf',
        filename: 'ISTP_Weapons_Specialist.pdf',
    },
]

export const personalitySourcesBody =
    'Content synthesized from my personal Crystal handbook (Crystal Knows) and an ISTP cognitive typing guide. Frameworks belong to their publishers; this page is for context only.'

export const personalityCrystalSource = {
    href: 'https://ai.crystalknows.com/p/Adib-Omar',
    iconSrc: '/icons/crystal.png',
    label: 'View on Crystal',
} as const

export function downloadPersonalityPdf(item: PersonalityDownload) {
    const link = document.createElement('a')
    link.href = item.href
    link.download = item.filename
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
