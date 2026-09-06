interface MarqueeProps {
  items: string[]
  reverse?: boolean
}

export function Marquee({ items, reverse = false }: MarqueeProps) {
  const content = items.join('   •   ') + '   •   '

  return (
    <div className="relative overflow-hidden border-y border-cream/10 bg-charcoal py-5">
      <div className={`flex w-max whitespace-nowrap ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}>
        <span className="font-display text-2xl tracking-widest2 text-cream/40 sm:text-3xl">{content}</span>
        <span className="font-display text-2xl tracking-widest2 text-cream/40 sm:text-3xl" aria-hidden="true">
          {content}
        </span>
      </div>
    </div>
  )
}
