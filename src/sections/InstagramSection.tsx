import { Flame, Instagram } from 'lucide-react'
import { SectionLabel } from '../components/SectionLabel'
import { SITE_CONFIG } from '../data/config'
import heroBurger from '../assets/photos/hero-burger.jpg'
import comboBurger from '../assets/photos/combo-burger.jpg'

const TILES = [
  { image: heroBurger, position: 'object-[65%_45%]' },
  { image: null },
  { image: comboBurger, position: 'object-[50%_60%]' },
  { image: null },
  { image: heroBurger, position: 'object-[20%_70%]' },
  { image: null },
  { image: comboBurger, position: 'object-[80%_30%]' },
  { image: null },
]

export function InstagramSection() {
  return (
    <section className="relative bg-charcoal px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel index="06" label="Instagram" />
            <h2 className="mt-6 font-display text-6xl leading-[0.9] text-cream sm:text-7xl">
              FEED THE FIRE.
            </h2>
          </div>
          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-wider text-cream/70 hover:text-ember"
          >
            <Instagram size={16} />
            {SITE_CONFIG.instagramHandle}
            <span className="h-px w-6 bg-current transition-all group-hover:w-10" />
          </a>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TILES.map((tile, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden bg-ash">
              {tile.image ? (
                <img
                  src={tile.image}
                  alt="Brasa Burger no Instagram"
                  loading="lazy"
                  className={`h-full w-full object-cover ${tile.position} transition-transform duration-700 group-hover:scale-110`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ash via-charcoal to-void">
                  <Flame size={32} strokeWidth={1} className="text-ember/20" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-void/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Instagram size={22} className="text-cream" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
