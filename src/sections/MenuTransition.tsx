import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function MenuTransition() {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.transition-text',
        { opacity: 0.15, scale: 0.85, letterSpacing: '-0.02em' },
        {
          opacity: 1,
          scale: 1,
          letterSpacing: '0em',
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={ref}
      className="relative flex h-[60vh] min-h-[380px] w-full items-center justify-center overflow-hidden bg-void"
    >
      <div className="absolute inset-0 bg-ember-glow opacity-30" aria-hidden="true" />
      <h2 className="transition-text px-6 text-center font-display text-[13vw] leading-[0.9] text-cream sm:text-7xl lg:text-8xl">
        ESCOLHA
        <br />
        <span className="text-ember">SUA ARMA.</span>
      </h2>
    </section>
  )
}
