import { Instagram } from 'lucide-react'
import { SectionLabel } from '../components/SectionLabel'
import { SITE_CONFIG } from '../data/config'
import heroBurger from '../assets/photos/hero-burger.jpg'
import comboBurger from '../assets/photos/combo-burger.jpg'

const TILES = [
  { image: heroBurger, position: 'object-[65%_45%]', alt: 'Hambúrguer com bacon e cheddar derretido.' },
  { image: comboBurger, position: 'object-[50%_60%]', alt: 'Hambúrguer duplo servido com fritas.' },
  { image: heroBurger, position: 'object-[25%_70%]', alt: 'Detalhe da carne e do bacon do hambúrguer.' },
]

export function InstagramSection() {
  return (
    <section className="bg-charcoal px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index="04" label="Instagram" />
            <h2 className="mt-5 font-display text-5xl leading-[0.95] text-cream sm:text-6xl">
              {SITE_CONFIG.instagramHandle}
            </h2>
          </div>
          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-wider text-cream/70 transition-colors hover:text-ember"
          >
            <Instagram size={16} />
            Seguir
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TILES.map((tile, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-ash">
              <img
                src={tile.image}
                alt={tile.alt}
                loading="lazy"
                decoding="async"
                className={`h-full w-full object-cover ${tile.position}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
