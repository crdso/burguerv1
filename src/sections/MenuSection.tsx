import { useMemo, useState } from 'react'
import type { Category, Product } from '../types'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { ProductCard } from '../products/ProductCard'
import { SectionLabel } from '../components/SectionLabel'

interface MenuSectionProps {
  onSelectProduct: (product: Product) => void
}

export function MenuSection({ onSelectProduct }: MenuSectionProps) {
  const [active, setActive] = useState<Category>('smash')

  const filtered = useMemo(() => PRODUCTS.filter((p) => p.category === active), [active])

  return (
    <section id="cardapio" className="relative bg-void px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel index="03" label="Cardápio" />
            <h2 className="mt-5 font-display text-6xl leading-[0.9] text-cream sm:text-7xl lg:text-8xl">
              O QUE VOCÊ
              <br />
              <span className="text-ember">VAI PEDIR?</span>
            </h2>
          </div>
          <p className="max-w-xs font-body text-sm text-cream/50">
            Todos os burgers saem na chapa, na hora do seu pedido. Escolha uma categoria abaixo.
          </p>
        </div>

        <div
          className="mt-12 flex snap-x gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible"
          role="tablist"
          aria-label="Categorias do cardápio"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={active === category.id}
              onClick={() => setActive(category.id)}
              className={`snap-start whitespace-nowrap rounded-full border px-6 py-3 font-body text-sm font-semibold uppercase tracking-wider transition-colors ${
                active === category.id
                  ? 'border-ember bg-ember text-void'
                  : 'border-cream/15 text-cream/70 hover:border-cream/40'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
  )
}
