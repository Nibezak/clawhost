import type { AIModelOption } from '@/ts/Interfaces'

const aiModels: AIModelOption[] = [
    {
        id: 'anthropic/claude-sonnet-4-5-20250929',
        name: 'Claude Sonnet 4.5',
        provider: 'Anthropic'
    },
    {
        id: 'anthropic/claude-haiku-4-5-20251001',
        name: 'Claude Haiku 4.5',
        provider: 'Anthropic'
    },
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
    { id: 'openai/o3-mini', name: 'o3-mini', provider: 'OpenAI' },
    {
        id: 'google/gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        provider: 'Google'
    },
    { id: 'google/gemini-2.0-pro', name: 'Gemini 2.0 Pro', provider: 'Google' }
]

export default aiModels