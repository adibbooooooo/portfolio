import { profileMeta, summaryCategories } from '@/data/personalitySummary'
import { caseStudyChunks } from '@/lib/knowledge/caseStudies'
import { experienceNarrativeChunks } from '@/lib/knowledge/experienceNarratives'
import {
    buildProjectChunkContent,
    buildProjectsListChunkContent,
    shippedProjects,
} from '@/lib/knowledge/projectsRag'
import { buildPeopleWordsChunks } from '@/lib/knowledge/peopleWordsRag'
import {
    buildVirtuosoFigureChunks,
    buildVirtuosoOverviewChunk,
    foundingEngineerFitChunk,
} from '@/lib/knowledge/personalityRag'
import type { KnowledgeChunk } from '@/lib/knowledge/types'

const MAX_CHUNK_CHARS = 1800

function splitText(idPrefix: string, topic: KnowledgeChunk['topic'], text: string): KnowledgeChunk[] {
    if (text.length <= MAX_CHUNK_CHARS) {
        return [{ id: idPrefix, topic, content: text }]
    }
    const parts: string[] = []
    let buf = ''
    for (const para of text.split(/\n{2,}/)) {
        const next = buf ? `${buf}\n\n${para}` : para
        if (next.length > MAX_CHUNK_CHARS && buf) {
            parts.push(buf)
            buf = para
        } else {
            buf = next
        }
    }
    if (buf) parts.push(buf)
    return parts.map((content, i) => ({
        id: `${idPrefix}-${i}`,
        topic,
        content,
    }))
}

export function buildKnowledgeChunks(): KnowledgeChunk[] {
    const out: KnowledgeChunk[] = []

    out.push({
        id: 'ai-dib-meta',
        topic: 'profile',
        content: [
            'AI-dib is the chat guide on adibomar.com, speaking as Adib Omar in first person.',
            'AI-dib answers about work, experience, shipped projects, problem-solving stories, personality, and contact.',
            'Browse work at /work: Projects (shipped apps), Stories (case studies), Demos (skill sandboxes only).',
            'Contact: work@adibomar.com, cal.com/adibomar/meeting, LinkedIn linkedin.com/in/adibomar.',
        ].join(' '),
    })

    out.push({
        id: 'profile-core',
        topic: 'profile',
        content: [
            `Name: Adib Omar. Title: Versatile Software Engineer. Location: Kuala Lumpur, Malaysia.`,
            `Archetype: ${profileMeta.archetype}. Type: ${profileMeta.typeLine}.`,
            `Tagline: ${profileMeta.tagline}`,
            `Bio: Software engineer focused on reliable systems, clear decisions, and shipping quality products. 6+ years experience. Languages: Malay, English.`,
        ].join('\n'),
    })

    for (const cat of summaryCategories) {
        for (const item of cat.items) {
            out.push({
                id: `summary-${item.id}`,
                topic: 'profile',
                content: `Category: ${cat.label}. Q: ${item.question} A: ${item.summary}`,
            })
        }
    }

    out.push(...buildPeopleWordsChunks())

    for (const exp of experienceNarrativeChunks) {
        out.push(...splitText(exp.id, exp.topic, exp.content))
    }

    for (const caseStudy of caseStudyChunks) {
        out.push(...splitText(caseStudy.id, caseStudy.topic, caseStudy.content))
    }

    out.push({
        id: 'profile-product-focus',
        topic: 'profile',
        content:
            'What kind of products do I work on? I build products that solve real problems and fit what the market or team needs, from internal tools and Web3 experiments to event sites and developer tooling. I care about shipping something useful, not buzzwords.',
    })

    out.push({
        id: 'projects-shipped-list',
        topic: 'projects',
        content: buildProjectsListChunkContent(),
    })

    for (const project of shippedProjects) {
        out.push({
            id: `project-${project.id}`,
            topic: 'projects',
            content: buildProjectChunkContent(project),
        })
    }

    out.push({
        id: 'contact',
        topic: 'contact',
        content:
            'Contact Adib Omar: email work@adibomar.com, phone +60 11 6177 0407, LinkedIn linkedin.com/in/adibomar, schedule a call at https://cal.com/adibomar/meeting. Open for collaboration.',
    })

    // Personality: summary Q&A (profile topic) + Virtuoso lane + SMB/founding-engineer fit
    out.push(foundingEngineerFitChunk)
    out.push(buildVirtuosoOverviewChunk())
    out.push(...buildVirtuosoFigureChunks())

    // Full Crystal/ISTP handbook PDFs are not indexed (reduces retrieval noise); download on my.personality page.

    return out
}
