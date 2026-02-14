import type { FC, ReactNode } from 'react'
import type { PlaygroundAgentNodeProps } from '@/ts/Interfaces'

import { Handle, Position } from '@xyflow/react'
import { ClawMascot } from '@/components/ClawMascot'

const handleStyle = {
    top: 0,
    width: 0,
    height: 0,
    minWidth: 0,
    minHeight: 0,
    border: 'none',
    background: 'none',
    opacity: 0
}

const PlaygroundAgentNode: FC<PlaygroundAgentNodeProps> = ({
    data
}): ReactNode => {
    const { agent, isSelected } = data

    return (
        <div
            className={`playground-node-enter relative w-[240px] cursor-pointer rounded-lg border border-l-2 bg-[#111114] transition-all ${
                isSelected
                    ? 'border-b-[#ef5350]/50 border-l-[#ef5350] border-r-[#ef5350]/50 border-t-[#ef5350]/50 shadow-[0_0_20px_rgba(239,83,80,0.15)]'
                    : 'border-b-white/[0.08] border-l-[#ef5350] border-r-white/[0.08] border-t-white/[0.08]'
            }`}
        >
            <Handle
                type='target'
                position={Position.Top}
                isConnectable={false}
                style={handleStyle}
            />

            <div className='px-3.5 py-3'>
                <div className='flex items-center gap-2'>
                    <ClawMascot className='h-4 w-4' />
                    <span className='flex-1 truncate text-sm font-medium text-white'>
                        {agent.name}
                    </span>
                </div>

                {agent.model && (
                    <div className='mt-2 inline-flex rounded-md bg-white/5 px-2 py-0.5'>
                        <span className='truncate text-[11px] text-gray-400'>
                            {agent.model}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PlaygroundAgentNode