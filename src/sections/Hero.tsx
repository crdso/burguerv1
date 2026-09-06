import { useLayoutEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { MagneticButton } from '../components/MagneticButton'
import heroBurger from '../assets/photos/hero-burger.jpg'

const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 8) % 96}%`,
  bottom: `${(i * 23) % 60}%`,
  delay: (i % 7) * 0.4,
  size: 2 + (i % 4),
}))

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (reducedMotion) {
        gsap.set(['.hero-line', '.hero-sub', '.hero-cta', '.hero-image', '.hero-scroll-cue'], {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
        })
        return
      }

      gsap.set('.hero-image', { scale: 1.18, opacity: 0 })
      gsap.set('.hero-line', { clipPath: 'inset(0 0 100% 0)', y: 40 })
      gsap.set(['.hero-sub', '.hero-cta', '.hero-scroll-cue'], { opacity: 0, y: 20 })

      tl.to('.hero-image', { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' })
        .to(
          '.hero-line',
          { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.1, stagger: 0.12 },
          '-=1.3',
        )
        .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.55')
        .to('.hero-scroll-cue', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    }, rootRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-void sm:items-center"
    >
      <div className="hero-image absolute inset-0" aria-hidden="true">
        <img
          src={heroBurger}
          alt=""
          className="h-full w-full object-cover object-[65%_45%] sm:object-[70%_50%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-void/10 sm:via-void/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />
        <div className="absolute inset-0 bg-ember-glow mix-blend-screen opacity-70" />
        <div className="absolute inset-0 bg-grain" />
      </div>

      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {EMBERS.map((ember, i) => (
            <span
              key={i}
              className="absolute animate-ember rounded-full bg-ember/70 blur-[1px]"
              style={{
                left: ember.left,
                bottom: ember.bottom,
                width: ember.size,
                height: ember.size,
                animationDelay: `${ember.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full px-5 pb-16 sm:px-8 sm:pb-0 lg:px-12">
        <div className="max-w-3xl">
          <h1 className="font-display leading-[0.85] text-cream">
            <span className="hero-line block overflow-hidden text-[20vw] tracking-tight sm:text-[9rem] lg:text-[10.5rem]">
              BRASA
            </span>
            <span className="hero-line block overflow-hidden text-[20vw] tracking-tight text-ember sm:text-[9rem] lg:text-[10.5rem]">
              BURGER
            </span>
          </h1>

          <p className="hero-sub mt-6 max-w-md font-body text-lg font-medium uppercase tracking-widest2 text-cream/80 sm:text-xl">
            Fogo. Carne. Respeito.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#cardapio" className="hero-cta">
              <MagneticButton variant="solid">Ver o cardápio</MagneticButton>
            </a>
            <a href="#cardapio" className="hero-cta">
              <MagneticButton variant="outline">Pedir agora</MagneticButton>
            </a>
          </div>
        </div>
      </div>

      <div className="hero-scroll-cue absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-cream/50 sm:flex">
        <span className="font-body text-[11px] uppercase tracking-widest2">Role</span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  )
}
