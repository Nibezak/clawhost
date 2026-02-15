const extractText = (content: unknown): string => {
    if (typeof content === 'string') return content
    if (Array.isArray(content)) {
        return content
            .filter((c) => c.type === 'text')
            .map((c) => c.text)
            .join('\n')
    }
    return ''
}

export default extractText