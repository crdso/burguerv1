import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SectionLabel } from '../components/SectionLabel'
import heroBurger from '../assets/photos/hero-burger.jpg'

export function FireSection() {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.fire-image',
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section id="fogo" ref={ref} className="relative h-[85vh] min-h-[520px] w-full overflow-hidden bg-void">
      <div className="absolute inset-0 scale-110" aria-hidden="true">
        <img
          src={heroBurger}
          alt=""
          className="fire-image h-full w-full object-cover object-[30%_75%] contrast-125 saturate-[1.15] sepia-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/75 to-void/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />
        <div className="absolute inset-0 mix-blend-overlay bg-brasa/20" />
      </div>

      <div className="relative z-10 flex h-full items-center px-5 sm:px-8 lg:px-16">
        <div className="max-w-xl">
          <SectionLabel index="02" label="A técnica" />
          <h2 className="mt-6 font-display text-[13vw] leading-[0.88] text-cream sm:text-6xl lg:text-7xl">
            NÃO É FAST FOOD.
            <br />
            <span className="text-ember">É FOGO BEM FEITO.</span>
          </h2>
          <p className="mt-6 max-w-sm font-body text-base text-cream/70 sm:text-lg">
            Cada burger sai da chapa para o pão. Sem estoque pronto. Sem atalho.
          </p>
        </div>
      </div>
    </section>
  )
}
