import { getProductById } from '../data/products'
import { formatBRL } from '../lib/format'
import { SectionLabel } from '../components/SectionLabel'
import { MagneticButton } from '../components/MagneticButton'
import type { Product } from '../types'
import comboBurger from '../assets/photos/combo-burger.jpg'

interface ComboSectionProps {
  onSelect: (product: Product) => void
}

export function ComboSection({ onSelect }: ComboSectionProps) {
  const combo = getProductById('combo-brasa')
  if (!combo) return null

  return (
    <section id="combo" className="relative w-full overflow-hidden bg-charcoal">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-[55vh] min-h-[380px] lg:h-auto lg:min-h-[640px]">
          <img src={comboBurger} alt={combo.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-charcoal/40" />
        </div>

        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 lg:py-0">
          <SectionLabel index="04" label="Combo" />
          <h2 className="mt-6 font-display text-6xl leading-[0.9] text-cream sm:text-7xl">
            {combo.name}
          </h2>
          <p className="mt-5 max-w-md font-body text-base text-cream/60 sm:text-lg">{combo.description}</p>
          <p className="mt-8 font-display text-5xl text-ember">{formatBRL(combo.price)}</p>

          <div className="mt-9">
            <MagneticButton variant="solid" onClick={() => onSelect(combo)}>
              Quero esse
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
