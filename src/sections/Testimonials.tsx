import { Star } from 'lucide-react'
import { SectionLabel } from '../components/SectionLabel'

interface Testimonial {
  quote: string
  author: string
  size: 'lg' | 'md'
}

const TESTIMONIALS: Testimonial[] = [
  { quote: 'Eu vim pela foto.\nVoltei pelo burger.', author: 'Lucas M.', size: 'lg' },
  { quote: 'Melhor smash da cidade, sem dúvida. O ponto da carne é sempre perfeito.', author: 'Rafaela T.', size: 'md' },
  { quote: 'Chega quente, chega no ponto. Isso muda tudo.', author: 'Diego A.', size: 'md' },
  { quote: 'O Truffle é surreal. Parece coisa de restaurante grande.', author: 'Marina C.', size: 'lg' },
]

export function Testimonials() {
  return (
    <section className="relative bg-void px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <SectionLabel index="03" label="Quem já provou" />
        <h2 className="mt-6 max-w-2xl font-display text-5xl leading-[0.95] text-cream sm:text-6xl lg:text-7xl">
          NÃO SOMOS NÓS QUEM DIZEMOS.
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.author}
              className={`flex flex-col justify-between border-t border-cream/15 pt-6 ${
                t.size === 'lg' ? 'sm:row-span-2 lg:col-span-2' : ''
              } ${i === 0 ? '' : 'lg:pt-6'}`}
            >
              <blockquote>
                <p
                  className={`whitespace-pre-line font-display leading-[1.05] text-cream ${
                    t.size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'
                  }`}
                >
                  {t.quote}
                </p>
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-between">
                <span className="font-body text-sm font-semibold uppercase tracking-wider text-cream/60">
                  — {t.author}
                </span>
                <span className="flex gap-0.5 text-ember" aria-label="5 de 5 estrelas">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
