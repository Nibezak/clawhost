import type { FC, ReactNode } from 'react'
import type { ChatSpeechButtonProps } from '@/ts/Interfaces'

import { t } from '@openclaw/i18n'
import {
    SpeakerHighIcon,
    ArrowCounterClockwiseIcon
} from '@phosphor-icons/react'

const ChatSpeechButton: FC<ChatSpeechButtonProps> = ({
    messageId,
    text,
    isSpeaking,
    onSpeak,
    onStop
}): ReactNode => {
    return (
        <button
            onClick={() => (isSpeaking ? onStop() : onSpeak(messageId, text))}
            title={
                isSpeaking
                    ? t('playground.chatStopSpeech')
                    : t('playground.chatPlaySpeech')
            }
            className='text-muted-foreground hover:text-foreground transition-colors'
        >
            {isSpeaking ? (
                <ArrowCounterClockwiseIcon className='h-3 w-3' weight='bold' />
            ) : (
                <SpeakerHighIcon className='h-3 w-3' weight='bold' />
            )}
        </button>
    )
}

export default ChatSpeechButton