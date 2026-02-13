import type { FC, ReactNode } from 'react'
import type { PlaygroundCanvasProps } from '@/ts/Interfaces'
import type { NodeMouseHandler } from '@xyflow/react'

import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider,
    useOnViewportChange
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import PlaygroundClawNode from '@/components/playground/PlaygroundClawNode'
import PlaygroundAgentNode from '@/components/playground/PlaygroundAgentNode'
import PlaygroundToolbar from '@/components/playground/PlaygroundToolbar'

interface PlaygroundCanvasInnerProps extends PlaygroundCanvasProps {
    zoom: number
    onZoomChange: (zoom: number) => void
    isFitView: boolean
    onFitViewChange: (value: boolean) => void
}

const PlaygroundCanvasInner: FC<PlaygroundCanvasInnerProps> = ({
    initialNodes,
    initialEdges,
    onNodeClick,
    onAgentClick,
    onPaneClick,
    panelOpen,
    selectedClawId,
    selectedAgentId,
    zoom,
    onZoomChange,
    isFitView,
    onFitViewChange
}): ReactNode => {
    const nodeTypes = useMemo(
        () => ({
            clawNode: PlaygroundClawNode,
            agentNode: PlaygroundAgentNode
        }),
        []
    )

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    const { fitView, getViewport, setViewport } = useReactFlow()
    const skipViewportRef = useRef(true)
    const containerRef = useRef<HTMLDivElement>(null)
    const panelWidth = 380

    useEffect(() => {
        const timer = setTimeout(() => {
            skipViewportRef.current = false
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    const prevNodeCountRef = useRef(initialNodes.length)

    useEffect(() => {
        setNodes(initialNodes)
        setEdges(initialEdges)

        if (initialNodes.length !== prevNodeCountRef.current && isFitView) {
            skipViewportRef.current = true
            setTimeout(() => {
                fitView({ padding: 0.3, duration: 300 })
                onFitViewChange(true)
                setTimeout(() => {
                    skipViewportRef.current = false
                }, 400)
            }, 50)
        }
        prevNodeCountRef.current = initialNodes.length
    }, [
        initialNodes,
        initialEdges,
        setNodes,
        setEdges,
        fitView,
        onFitViewChange,
        isFitView
    ])

    useEffect(() => {
        setNodes((prev) =>
            prev.map((node) => {
                if (node.type === 'clawNode') {
                    const clawId = node.id.replace('claw-', '')
                    const isSelected =
                        selectedClawId === clawId && !selectedAgentId
                    if (
                        (node.data as Record<string, unknown>).isSelected ===
                        isSelected
                    )
                        return node
                    return { ...node, data: { ...node.data, isSelected } }
                }
                if (node.type === 'agentNode') {
                    const parts = node.id.replace('agent-', '').split('-')
                    const agentId = parts.slice(1).join('-') || parts[0]
                    const isSelected = selectedAgentId === agentId
                    if (
                        (node.data as Record<string, unknown>).isSelected ===
                        isSelected
                    )
                        return node
                    return { ...node, data: { ...node.data, isSelected } }
                }
                return node
            })
        )
    }, [selectedClawId, selectedAgentId, setNodes])

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>
        const handleResize = () => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                skipViewportRef.current = true
                fitView({ padding: 0.3, duration: 300 })
                onFitViewChange(true)
                setTimeout(() => {
                    skipViewportRef.current = false
                }, 400)
            }, 200)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(timeout)
        }
    }, [fitView, onFitViewChange])

    const prevPanelOpenRef = useRef(panelOpen)
    useEffect(() => {
        if (prevPanelOpenRef.current !== panelOpen) {
            prevPanelOpenRef.current = panelOpen
            const viewport = getViewport()
            const shift = panelWidth / 2
            skipViewportRef.current = true
            setViewport(
                {
                    x: panelOpen ? viewport.x - shift : viewport.x + shift,
                    y: viewport.y,
                    zoom: viewport.zoom
                },
                { duration: 0 }
            )
            setTimeout(() => {
                skipViewportRef.current = false
            }, 50)
        }
    }, [panelOpen, getViewport, setViewport])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) return

            e.preventDefault()
            e.stopPropagation()

            const viewport = getViewport()
            const wheelDeltaY = (e as unknown as Record<string, unknown>)
                .wheelDeltaY as number | undefined
            const isMouseWheel =
                e.deltaMode === 1 ||
                (typeof wheelDeltaY === 'number' &&
                    wheelDeltaY !== 0 &&
                    wheelDeltaY % 120 === 0)

            if (!isMouseWheel) {
                setViewport({
                    x: viewport.x - e.deltaX,
                    y: viewport.y - e.deltaY,
                    zoom: viewport.zoom
                })
            } else {
                const rect = el.getBoundingClientRect()
                const mouseX = e.clientX - rect.left
                const mouseY = e.clientY - rect.top
                const pointX = (mouseX - viewport.x) / viewport.zoom
                const pointY = (mouseY - viewport.y) / viewport.zoom
                const zoomFactor = 1 + e.deltaY * 0.01
                const newZoom = Math.min(
                    1.5,
                    Math.max(0.5, viewport.zoom * zoomFactor)
                )
                setViewport({
                    x: mouseX - pointX * newZoom,
                    y: mouseY - pointY * newZoom,
                    zoom: newZoom
                })
            }
        }

        el.addEventListener('wheel', handleWheel, {
            passive: false,
            capture: true
        })
        return () =>
            el.removeEventListener('wheel', handleWheel, { capture: true })
    }, [getViewport, setViewport])

    const [nodesOutOfView, setNodesOutOfView] = useState(false)

    useOnViewportChange({
        onEnd: (viewport) => {
            onZoomChange(viewport.zoom)
        },
        onChange: (viewport) => {
            if (skipViewportRef.current) {
                setNodesOutOfView(false)
                return
            }
            onZoomChange(viewport.zoom)
            onFitViewChange(false)
            const el = containerRef.current
            if (!el || nodes.length === 0) return
            const { width, height } = el.getBoundingClientRect()
            const visMinX = -viewport.x / viewport.zoom
            const visMinY = -viewport.y / viewport.zoom
            const visMaxX = visMinX + width / viewport.zoom
            const visMaxY = visMinY + height / viewport.zoom
            const allOutside = nodes.every(
                (n) =>
                    n.position.x + 300 < visMinX ||
                    n.position.x > visMaxX ||
                    n.position.y + 200 < visMinY ||
                    n.position.y > visMaxY
            )
            setNodesOutOfView(allOutside)
        }
    })

    const handleNodeClick: NodeMouseHandler = useCallback(
        (_event, node) => {
            if (node.type === 'clawNode' && onNodeClick) {
                const clawId = node.id.replace('claw-', '')
                onNodeClick(clawId)
            }
            if (node.type === 'agentNode' && onAgentClick) {
                const nodeData = node.data as Record<string, unknown>
                const agentObj = nodeData.agent as Record<string, unknown>
                const agentId = agentObj?.id as string
                const clawId = nodeData.clawId as string
                if (agentId && clawId) {
                    onAgentClick(agentId, clawId)
                }
            }
        },
        [onNodeClick, onAgentClick]
    )

    const handlePaneClick = useCallback(() => {
        if (onPaneClick) {
            onPaneClick()
        }
    }, [onPaneClick])

    const handleFitView = useCallback(() => {
        const el = containerRef.current
        if (!el || nodes.length === 0) return

        skipViewportRef.current = true
        onFitViewChange(true)
        setNodesOutOfView(false)

        const { width, height } = el.getBoundingClientRect()
        const padding = 0.3

        let minX = Infinity
        let minY = Infinity
        let maxX = -Infinity
        let maxY = -Infinity
        nodes.forEach((n) => {
            const nw = n.measured?.width ?? 250
            const nh = n.measured?.height ?? 150
            minX = Math.min(minX, n.position.x)
            minY = Math.min(minY, n.position.y)
            maxX = Math.max(maxX, n.position.x + nw)
            maxY = Math.max(maxY, n.position.y + nh)
        })

        const gw = maxX - minX
        const gh = maxY - minY
        const targetZoom = Math.max(
            0.5,
            Math.min(
                1.5,
                Math.min(
                    width / (gw * (1 + padding * 2)),
                    height / (gh * (1 + padding * 2))
                )
            )
        )
        const targetX = (width - gw * targetZoom) / 2 - minX * targetZoom
        const targetY = (height - gh * targetZoom) / 2 - minY * targetZoom

        const start = getViewport()
        const duration = 500
        const startTime = performance.now()
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

        const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1)
            const t = easeOut(progress)
            setViewport({
                x: start.x + (targetX - start.x) * t,
                y: start.y + (targetY - start.y) * t,
                zoom: start.zoom + (targetZoom - start.zoom) * t
            })
            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                skipViewportRef.current = false
            }
        }

        requestAnimationFrame(animate)
    }, [nodes, getViewport, setViewport, onFitViewChange])

    return (
        <div ref={containerRef} className='relative h-full w-full'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                proOptions={{ hideAttribution: true }}
                elementsSelectable={false}
                nodesConnectable={false}
                minZoom={0.5}
                maxZoom={1.5}
                zoomOnScroll={false}
                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            />
            <PlaygroundToolbar
                zoom={zoom}
                onFitView={handleFitView}
                isFitView={isFitView}
                nodesOutOfView={nodesOutOfView}
            />
        </div>
    )
}

const PlaygroundCanvas: FC<PlaygroundCanvasProps> = ({
    initialNodes,
    initialEdges,
    onNodeClick,
    onAgentClick,
    onPaneClick,
    panelOpen,
    selectedClawId,
    selectedAgentId
}): ReactNode => {
    const [zoom, setZoom] = useState(0.8)
    const [isFitView, setIsFitView] = useState(true)

    return (
        <ReactFlowProvider>
            <PlaygroundCanvasInner
                initialNodes={initialNodes}
                initialEdges={initialEdges}
                onNodeClick={onNodeClick}
                onAgentClick={onAgentClick}
                onPaneClick={onPaneClick}
                panelOpen={panelOpen}
                selectedClawId={selectedClawId}
                selectedAgentId={selectedAgentId}
                zoom={zoom}
                onZoomChange={setZoom}
                isFitView={isFitView}
                onFitViewChange={setIsFitView}
            />
        </ReactFlowProvider>
    )
}

export default PlaygroundCanvas