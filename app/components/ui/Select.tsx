// app/components/ui/Select.tsx - FIXED VERSION
'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

export function Select({ value, onValueChange, children }: SelectProps) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1" onClick={() => setOpen(false)}>
          {React.Children.toArray(children).find(
            child => React.isValidElement(child) && child.type === SelectContent
          )}
        </div>
      )}
    </>
  )
}

export function SelectValue({ 
  placeholder,
  options 
}: { 
  placeholder?: string
  options?: Array<{ value: string; label: string }>
}) {
  const context = React.useContext(SelectContext)
  const value = context?.value || ''

  return (
    <span className="truncate">
      {value ? (
        options?.find(opt => opt.value === value)?.label || value
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </span>
  )
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-md border bg-popover text-popover-foreground shadow-md">
      {children}
    </div>
  )
}

export function SelectItem({
  value,
  children,
  className,
  ...props
}: {
  value: string
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SelectContext)

  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-selected:bg-accent data-selected:text-accent-foreground",
        className
      )}
      onClick={() => context?.onValueChange(value)}
      data-selected={context?.value === value}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {context?.value === value && (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
      </span>
      {children}
    </button>
  )
}