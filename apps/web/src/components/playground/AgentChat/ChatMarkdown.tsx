import type { FC, ReactNode } from 'react'
import type { ChatMarkdownProps } from '@/ts/Interfaces'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ChatMarkdown: FC<ChatMarkdownProps> = ({ content }): ReactNode => {
    return (
        <div className='prose prose-sm prose-invert prose-p:my-1 prose-p:leading-relaxed prose-pre:my-2 prose-pre:overflow-x-auto prose-pre:bg-white/10 prose-pre:p-3 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:mb-2 prose-headings:mt-3 prose-a:text-[#ef5350] prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-lg prose-img:my-2 prose-img:rounded-lg prose-hr:border-white/10 prose-blockquote:border-white/20 prose-blockquote:text-gray-400 prose-strong:text-white prose-th:text-gray-300 prose-td:text-gray-400 min-w-0 max-w-none break-words'>
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>
    )
}

export default ChatMarkdown