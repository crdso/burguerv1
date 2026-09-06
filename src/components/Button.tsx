import type { MouseEventHandler, ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'solid' | 'outline'
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit'
  disabled?: boolean
  'aria-label'?: string
}

const VARIANTS = {
  solid: 'bg-flame text-paper hover:bg-ink',
  outline: 'border border-ink/25 text-ink hover:border-flame hover:text-flame',
}

export function Button({
  children,
  variant = 'solid',
  className = '',
  onClick,
  type = 'button',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-body text-sm font-bold uppercase tracking-widest transition-colors duration-200 disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
