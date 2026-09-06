import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Layer {
  id: string
  label: string
  width: string
  height: string
  className: string
  rounded: string
}

const LAYERS: Layer[] = [
  {
    id: 'pao-superior',
    label: 'Pão superior',
    width: 'w-[78%]',
    height: 'h-8 sm:h-10',
    className: 'bg-gradient-to-b from-[#E8A855] to-[#B9762F] shadow-[0_10px_24px_rgba(0,0,0,0.5)]',
    rounded: 'rounded-t-full rounded-b-2xl',
  },
  {
    id: 'molho',
    label: 'Molho',
    width: 'w-[70%]',
    height: 'h-2.5',
    className: 'bg-gradient-to-r from-brasa via-[#F0491E] to-brasa shadow-[0_0_18px_rgba(217,45,21,0.55)]',
    rounded: 'rounded-full',
  },
  {
    id: 'cebola',
    label: 'Cebola',
    width: 'w-[68%]',
    height: 'h-3',
    className: 'bg-cream/25 backdrop-blur-sm border border-cream/30',
    rounded: 'rounded-full',
  },
  {
    id: 'queijo-1',
    label: 'Queijo',
    width: 'w-[74%]',
    height: 'h-4',
    className:
      'bg-gradient-to-b from-[#FFC94A] to-[#E39A1B] shadow-[0_6px_16px_rgba(227,154,27,0.4)] [clip-path:polygon(0_0,100%_0,96%_100%,88%_60%,78%_100%,64%_55%,50%_100%,36%_55%,22%_100%,12%_60%,4%_100%)]',
    rounded: '',
  },
  {
    id: 'carne-1',
    label: 'Carne',
    width: 'w-[72%]',
    height: 'h-6 sm:h-7',
    className: 'bg-gradient-to-b from-[#4A2E22] to-[#2A1912] shadow-[0_10px_20px_rgba(0,0,0,0.55)]',
    rounded: 'rounded-2xl',
  },
  {
    id: 'queijo-2',
    label: 'Queijo',
    width: 'w-[74%]',
    height: 'h-4',
    className:
      'bg-gradient-to-b from-[#FFC94A] to-[#E39A1B] shadow-[0_6px_16px_rgba(227,154,27,0.4)] [clip-path:polygon(0_0,100%_0,96%_100%,88%_60%,78%_100%,64%_55%,50%_100%,36%_55%,22%_100%,12%_60%,4%_100%)]',
    rounded: '',
  },
  {
    id: 'carne-2',
    label: 'Carne',
    width: 'w-[72%]',
    height: 'h-6 sm:h-7',
    className: 'bg-gradient-to-b from-[#4A2E22] to-[#2A1912] shadow-[0_10px_20px_rgba(0,0,0,0.55)]',
    rounded: 'rounded-2xl',
  },
  {
    id: 'picles',
    label: 'Picles',
    width: 'w-[62%]',
    height: 'h-3',
    className: 'bg-gradient-to-r from-[#7A9A3C] via-[#9CBE55] to-[#7A9A3C]',
    rounded: 'rounded-full',
  },
  {
    id: 'pao-inferior',
    label: 'Pão inferior',
    width: 'w-[76%]',
    height: 'h-6 sm:h-7',
    className: 'bg-gradient-to-b from-[#C98A3E] to-[#8F5B22] shadow-[0_10px_24px_rgba(0,0,0,0.5)]',
    rounded: 'rounded-b-full rounded-t-md',
  },
]

const CAPTIONS = [
  { at: 0.06, text: 'Brioche tostado na manteiga.' },
  { at: 0.26, text: 'Molho Brasa, receita da casa.' },
  { at: 0.46, text: 'Cheddar derretido no calor da chapa.' },
  { at: 0.66, text: 'Blend da casa, 160g.' },
  { at: 0.86, text: 'Sem atalhos.' },
]

const CENTER_INDEX = 4

export function ScrollStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [captionIndex, setCaptionIndex] = useState(0)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>('.stack-layer')

      const spreadTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=280%',
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress
            let next = 0
            for (let i = 0; i < CAPTIONS.length; i++) {
              if (progress >= CAPTIONS[i].at) next = i
            }
            setCaptionIndex(next)
          },
        },
      })

      layers.forEach((layer, i) => {
        const distanceFromCenter = i - CENTER_INDEX
        const spread = distanceFromCenter * (window.innerWidth < 640 ? 34 : 56)
        spreadTl.to(
          layer,
          { y: spread, duration: 0.5, ease: 'power2.inOut' },
          0,
        )
      })

      layers.forEach((layer, i) => {
        const distanceFromCenter = i - CENTER_INDEX
        const spread = distanceFromCenter * (window.innerWidth < 640 ? 34 : 56)
        spreadTl.to(layer, { y: spread, duration: 0.25, ease: 'power1.inOut' }, 0.5)
        spreadTl.to(layer, { y: 0, duration: 0.5, ease: 'power2.inOut' }, 0.75)
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen min-h-[560px] w-full flex-col items-center justify-center overflow-hidden bg-charcoal"
      aria-label="Composição do Brasa Classic"
    >
      <div className="absolute inset-0 bg-ember-glow opacity-40" aria-hidden="true" />
      <div className="absolute inset-0 bg-grain" aria-hidden="true" />

      <div className="relative z-10 grid w-full max-w-[1400px] grid-cols-1 items-center gap-8 px-6 sm:px-10 lg:grid-cols-2 lg:gap-4 lg:px-16">
        <div className="order-2 lg:order-1">
          <p className="font-body text-xs font-semibold uppercase tracking-widest2 text-ember">
            A composição
          </p>
          <div className="relative mt-4 h-24 sm:h-28">
            {CAPTIONS.map((caption, i) => (
              <p
                key={caption.text}
                className={`absolute inset-0 flex items-center font-display text-4xl leading-[0.95] text-cream transition-opacity duration-500 sm:text-5xl lg:text-6xl ${
                  i === captionIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {caption.text}
              </p>
            ))}
          </div>
        </div>

        <div className="order-1 flex items-center justify-center lg:order-2" aria-hidden="true">
          <div className="relative flex w-full max-w-sm flex-col items-center py-16 sm:max-w-md sm:py-24">
            {reducedMotion ? (
              <div className="flex w-full flex-col items-center gap-1.5">
                {LAYERS.map((layer) => (
                  <div key={layer.id} className={`${layer.width} ${layer.height} ${layer.className} ${layer.rounded}`} />
                ))}
              </div>
            ) : (
              LAYERS.map((layer) => (
                <div
                  key={layer.id}
                  className={`stack-layer -mt-1.5 ${layer.width} ${layer.height} ${layer.className} ${layer.rounded}`}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <span className="sr-only">
        Pão brioche, molho Brasa, cebola caramelizada, cheddar, blend 160g, cheddar, blend 160g, picles e pão inferior.
      </span>
    </section>
  )
}
