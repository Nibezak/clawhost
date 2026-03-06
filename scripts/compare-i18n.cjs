const fs = require('fs')

function extractKeys(content) {
    const keys = []
    const lines = content.split('\n')
    const stack = []

    for (const line of lines) {
        const trimmed = line.trim()
        const sectionMatch = trimmed.match(/^(\w+)\s*:\s*\{/)
        if (
            sectionMatch &&
            trimmed.indexOf("'") === -1 &&
            trimmed.indexOf('`') === -1
        ) {
            stack.push(sectionMatch[1])
            continue
        }
        const kvMatch = trimmed.match(/^(\w+)\s*:\s*['"`]/)
        if (kvMatch) {
            const fullKey = [...stack, kvMatch[1]].join('.')
            keys.push(fullKey)
        }
        if (trimmed === '},' || trimmed === '}') {
            if (stack.length > 0) stack.pop()
        }
    }
    return new Set(keys)
}

const en = fs.readFileSync('packages/i18n/src/langs/en.ts', 'utf8')
const fr = fs.readFileSync('packages/i18n/src/langs/fr.ts', 'utf8')
const es = fs.readFileSync('packages/i18n/src/langs/es.ts', 'utf8')
const de = fs.readFileSync('packages/i18n/src/langs/de.ts', 'utf8')

const enKeys = extractKeys(en)
const frKeys = extractKeys(fr)
const esKeys = extractKeys(es)
const deKeys = extractKeys(de)

const missingFr = [...enKeys].filter((k) => !frKeys.has(k)).sort()
const missingEs = [...enKeys].filter((k) => !esKeys.has(k)).sort()
const missingDe = [...enKeys].filter((k) => !deKeys.has(k)).sort()

const extraFr = [...frKeys].filter((k) => !enKeys.has(k)).sort()
const extraEs = [...esKeys].filter((k) => !enKeys.has(k)).sort()
const extraDe = [...deKeys].filter((k) => !enKeys.has(k)).sort()

console.log('EN total keys:', enKeys.size)
console.log('FR total keys:', frKeys.size)
console.log('ES total keys:', esKeys.size)
console.log('DE total keys:', deKeys.size)
console.log()
console.log('MISSING FROM FR (' + missingFr.length + '):')
missingFr.forEach((k) => console.log('  ' + k))
console.log()
console.log('EXTRA IN FR (' + extraFr.length + '):')
extraFr.forEach((k) => console.log('  ' + k))
console.log()
console.log('MISSING FROM ES (' + missingEs.length + '):')
missingEs.forEach((k) => console.log('  ' + k))
console.log()
console.log('EXTRA IN ES (' + extraEs.length + '):')
extraEs.forEach((k) => console.log('  ' + k))
console.log()
console.log('MISSING FROM DE (' + missingDe.length + '):')
missingDe.forEach((k) => console.log('  ' + k))
console.log()
console.log('EXTRA IN DE (' + extraDe.length + '):')
extraDe.forEach((k) => console.log('  ' + k))