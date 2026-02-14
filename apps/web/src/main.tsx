import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import App from '@/App'
import '@/index.css'

const PERSISTABLE_QUERIES = new Set(['profile', 'userStats'])

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24
        }
    }
})

const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: 'clawhost_query_cache'
})

document.addEventListener('dblclick', (e) => {
    e.preventDefault()
})

document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
})

document.addEventListener('keydown', (e) => {
    const isMod = e.metaKey || e.ctrlKey

    if (
        isMod &&
        e.altKey &&
        ['KeyI', 'KeyJ', 'KeyC', 'KeyU'].includes(e.code)
    ) {
        e.preventDefault()
    }

    if (isMod && e.shiftKey && ['KeyI', 'KeyJ', 'KeyC'].includes(e.code)) {
        e.preventDefault()
    }

    if (isMod && e.code === 'KeyU') {
        e.preventDefault()
    }

    if (e.code === 'F12') {
        e.preventDefault()
    }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                maxAge: 1000 * 60 * 60 * 24,
                dehydrateOptions: {
                    shouldDehydrateQuery: (query) => {
                        const key = query.queryKey[0] as string
                        return (
                            query.state.status === 'success' &&
                            PERSISTABLE_QUERIES.has(key)
                        )
                    }
                }
            }}
        >
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistQueryClientProvider>
    </React.StrictMode>
)