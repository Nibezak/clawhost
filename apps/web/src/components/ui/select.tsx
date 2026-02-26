import * as React from 'react'
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib'

interface SelectProps {
    value: string
    onValueChange: (value: string) => void
    children: React.ReactNode
    disabled?: boolean
    displayValue?: string
}

interface SelectTriggerProps {
    placeholder?: string
    className?: string
    icon?: React.ReactNode
}

interface SelectContentProps {
    children: React.ReactNode
    className?: string
    align?: 'start' | 'center' | 'end'
}

interface SelectItemProps {
    value: string
    children: React.ReactNode
    className?: string
}

interface SelectGroupProps {
    label: string
    children: React.ReactNode
    isLast?: boolean
}

const SelectContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
    displayText: string
    setDisplayText: (text: string) => void
}>({
    value: '',
    onValueChange: () => {},
    displayText: '',
    setDisplayText: () => {}
})

const Select = ({
    value,
    onValueChange,
    children,
    disabled,
    displayValue
}: SelectProps) => {
    const [displayText, setDisplayText] = React.useState(displayValue || '')

    React.useEffect(() => {
        if (displayValue !== undefined) {
            setDisplayText(displayValue)
        }
    }, [displayValue])

    return (
        <SelectContext.Provider
            value={{ value, onValueChange, displayText, setDisplayText }}
        >
            <DropdownMenu>
                {React.Children.map(children, (child) => {
                    if (
                        React.isValidElement(child) &&
                        child.type === SelectTrigger
                    ) {
                        return React.cloneElement(
                            child as React.ReactElement<
                                SelectTriggerProps & { disabled?: boolean }
                            >,
                            { disabled }
                        )
                    }
                    return child
                })}
            </DropdownMenu>
        </SelectContext.Provider>
    )
}

const SelectTrigger = ({
    placeholder,
    className,
    icon,
    disabled
}: SelectTriggerProps & { disabled?: boolean }) => {
    const { displayText } = React.useContext(SelectContext)

    return (
        <DropdownMenuTrigger asChild disabled={disabled}>
            <button
                type='button'
                className={cn(
                    'border-input bg-background focus-visible:ring-ring flex h-11 w-full items-center justify-between rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
                    !displayText && 'text-muted-foreground',
                    className
                )}
            >
                <span className='flex items-center gap-2 truncate'>
                    {icon}
                    {displayText || placeholder}
                </span>
                <CaretDownIcon className='h-4 w-4 shrink-0 opacity-50' />
            </button>
        </DropdownMenuTrigger>
    )
}

const SelectContent = ({
    children,
    className,
    align = 'start'
}: SelectContentProps) => {
    return (
        <DropdownMenuContent
            align={align}
            className={cn('w-[--radix-dropdown-menu-trigger-width]', className)}
        >
            {children}
        </DropdownMenuContent>
    )
}

const SelectItem = ({ value, children, className }: SelectItemProps) => {
    const {
        value: selectedValue,
        onValueChange,
        setDisplayText
    } = React.useContext(SelectContext)
    const isSelected = selectedValue === value
    const textRef = React.useRef<string>('')

    React.useEffect(() => {
        if (isSelected && textRef.current) {
            setDisplayText(textRef.current)
        }
    }, [isSelected, setDisplayText])

    return (
        <DropdownMenuItem
            className={cn(
                'flex cursor-pointer items-center justify-between gap-2',
                className
            )}
            onSelect={() => {
                onValueChange(value)
                setDisplayText(textRef.current)
            }}
        >
            <span
                ref={(el) => {
                    if (el) textRef.current = el.textContent || ''
                }}
            >
                {children}
            </span>
            {isSelected && <CheckIcon className='h-4 w-4 shrink-0' />}
        </DropdownMenuItem>
    )
}

const SelectGroup = ({ label, children, isLast }: SelectGroupProps) => {
    return (
        <>
            <DropdownMenuLabel className='text-muted-foreground text-xs font-medium'>
                {label}
            </DropdownMenuLabel>
            {children}
            {!isLast && <DropdownMenuSeparator />}
        </>
    )
}

export { Select, SelectTrigger, SelectContent, SelectItem, SelectGroup }