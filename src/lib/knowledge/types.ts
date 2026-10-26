export type KnowledgeChunk = {
    id: string
    topic: 'profile' | 'experience' | 'projects' | 'cases' | 'personality' | 'contact'
    content: string
}
