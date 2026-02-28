import type { Plugin } from 'vite'

import fs from 'fs'

function sanitizeYAML(content: string): string {
    let sanitized = content

    sanitized = sanitized.replace(/\u2014/g, '-')

    sanitized = sanitized.replace(/[\u201C\u201D]/g, '"')
    sanitized = sanitized.replace(/[\u2018\u2019]/g, "'")

    // eslint-disable-next-line no-control-regex
    sanitized = sanitized.replace(/[^\x00-\x7F\n\r\t ]/g, '')

    const frontmatterMatch = sanitized.match(/^---\n([\s\S]*?)\n---/)
    if (frontmatterMatch) {
        let frontmatter = frontmatterMatch[1]

        frontmatter = frontmatter
            .split('\n')
            .map((line: string) => {
                if (line.match(/^\s*-\s+['"`]/)) {
                    const match = line.match(/^\s*(-\s+)['"`]\s*(.+?)\s*['"`]/)
                    if (match) {
                        return `${match[1]}${match[2]}`
                    }
                }

                if (/^\s*\d+\s*:/.test(line)) {
                    return '# ' + line
                }

                return line
            })
            .join('\n')

        sanitized = sanitized.replace(
            /^---\n[\s\S]*?\n---/,
            `---\n${frontmatter}\n---`
        )
    }

    return sanitized
}

function escapeProseLine(line: string): string {
    const segments: string[] = []
    let remaining = line
    const inlineCodePattern = /`[^`]*`/

    while (remaining.length > 0) {
        const match = remaining.match(inlineCodePattern)
        if (!match || match.index === undefined) {
            segments.push(escapeSegment(remaining))
            break
        }

        if (match.index > 0) {
            segments.push(escapeSegment(remaining.slice(0, match.index)))
        }
        segments.push(match[0])
        remaining = remaining.slice(match.index + match[0].length)
    }

    return segments.join('')
}

function escapeSegment(text: string): string {
    return text
        .replace(/<(?![a-zA-Z/!])/g, '&lt;')
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;')
}

function escapeJsxInBody(content: string): string {
    const lines = content.split('\n')
    let inFrontmatter = false
    let inCodeBlock = false
    const result: string[] = []

    for (const line of lines) {
        if (line.trim() === '---' && !inCodeBlock) {
            inFrontmatter = !inFrontmatter
            result.push(line)
            continue
        }

        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock
            result.push(line)
            continue
        }

        if (inFrontmatter || inCodeBlock) {
            result.push(line)
            continue
        }

        result.push(escapeProseLine(line))
    }

    return result.join('\n')
}

const viteMdxSanitize = (): Plugin => {
    return {
        name: 'vite-mdx-sanitize',
        enforce: 'pre',

        async load(id: string) {
            if (!id.endsWith('.mdx')) {
                return null
            }

            try {
                const content = fs.readFileSync(id, 'utf-8')

                let sanitized = sanitizeYAML(content)
                sanitized = escapeJsxInBody(sanitized)

                return {
                    code: sanitized,
                    map: null
                }
            } catch (error) {
                console.error(`Error loading MDX file ${id}:`, error)
                return null
            }
        }
    }
}

export default viteMdxSanitize