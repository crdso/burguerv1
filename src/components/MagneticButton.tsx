import { useRef, type MouseEventHandler, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface MagneticButtonProps {
  children: ReactNode
  variant?: 'solid' | 'outline'
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit'
  disabled?: boolean
  'aria-label'?: string
}

export function MagneticButton({
  children,
  variant = 'solid',
  className = '',
  onClick,
  type = 'button',
  disabled,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 })

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (reducedMotion || event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = event.clientX - rect.left - rect.width / 2
    const relY = event.clientY - rect.top - rect.height / 2
    x.set(relX * 0.25)
    y.set(relY * 0.35)
  }

  function handlePointerLeave() {
    x.set(0)
    y.set(0)
  }

  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest2 transition-colors duration-300 focus-visible:outline-offset-4'
  const styles =
    variant === 'solid'
      ? 'bg-ember text-void hover:bg-brasa'
      : 'border border-cream/30 text-cream hover:border-ember hover:text-ember'

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`${base} ${styles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
