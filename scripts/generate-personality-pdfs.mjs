/**
 * One-off generator: handbook .txt → PDF in public/pdf/personality/
 * Run: node scripts/generate-personality-pdfs.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument, StandardFonts } from 'pdf-lib'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const jobs = [
    {
        input: 'src/data/personality/crystal-handbook.txt',
        output: 'public/pdf/personality/crystal-handbook.pdf',
    },
    {
        input: 'src/data/personality/istp-weapons-specialist.txt',
        output: 'public/pdf/personality/istp-cognitive-guide.pdf',
    },
]

function wrapLine(text, font, size, maxWidth) {
    if (!text.trim()) return ['']
    const words = text.split(/\s+/)
    const lines = []
    let current = ''
    for (const word of words) {
        const next = current ? `${current} ${word}` : word
        if (font.widthOfTextAtSize(next, size) <= maxWidth) {
            current = next
        } else {
            if (current) lines.push(current)
            current = word
        }
    }
    if (current) lines.push(current)
    return lines.length ? lines : ['']
}

function sanitizeForPdf(text) {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/[^\t\n\x20-\x7e]/g, ' ')
        .replace(/[ \t]+\n/g, '\n')
}

async function txtToPdf(inputPath, outputPath) {
    const text = sanitizeForPdf(fs.readFileSync(inputPath, 'utf8'))
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 9
    const margin = 48
    const pageWidth = 612
    const pageHeight = 792
    const maxWidth = pageWidth - margin * 2
    const lineHeight = fontSize * 1.35

    let page = pdfDoc.addPage([pageWidth, pageHeight])
    let y = pageHeight - margin

    for (const paragraph of text.split('\n')) {
        const lines = wrapLine(paragraph, font, fontSize, maxWidth)
        for (const line of lines) {
            if (y < margin + lineHeight) {
                page = pdfDoc.addPage([pageWidth, pageHeight])
                y = pageHeight - margin
            }
            page.drawText(line, { x: margin, y: y - fontSize, size: fontSize, font })
            y -= lineHeight
        }
        y -= lineHeight * 0.35
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, await pdfDoc.save())
}

for (const job of jobs) {
    const input = path.join(root, job.input)
    const output = path.join(root, job.output)
    await txtToPdf(input, output)
    console.log('Wrote', output)
}
