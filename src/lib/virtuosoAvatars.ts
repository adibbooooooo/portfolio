import type { VirtuosoFigure } from '@/data/personalityVirtuosoLane'
import type { LogoLoopItem } from '@/components/personality/LogoLoop.vue'

/** Illustrated avatar per figure (deterministic, no API at runtime). */
export function virtuosoFigureAvatarSrc(id: string) {
    return `https://api.dicebear.com/9.x/notionists-neutral/png?seed=${encodeURIComponent(id)}&backgroundColor=141414&radius=12&size=128`
}

export function buildFiguresLikeMeItems(figures: VirtuosoFigure[]): LogoLoopItem[] {
    return figures.map((f) => ({
        id: f.id,
        name: f.name,
        shortName: f.name.split('/')[0]?.trim() ?? f.name,
        src: f.avatarSrc ?? virtuosoFigureAvatarSrc(f.id),
        note: f.note,
    }))
}

export function buildVirtuosoLoopItems(figures: VirtuosoFigure[]): LogoLoopItem[] {
    const self: LogoLoopItem = {
        id: 'adib-istp',
        name: 'Adib Omar',
        shortName: 'You · ISTP-T',
        src: '/istp.png',
        note: 'My Virtuoso profile',
        featured: true,
    }

    const lane = figures.map((f) => ({
        id: f.id,
        name: f.name,
        shortName: f.name.split('/')[0]?.trim() ?? f.name,
        src: f.avatarSrc ?? virtuosoFigureAvatarSrc(f.id),
        note: f.note,
    }))

    return [self, ...lane]
}
