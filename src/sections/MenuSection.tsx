import { useMemo, useState } from 'react'
import type { Category, Product } from '../types'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { ProductCard } from '../products/ProductCard'

interface MenuSectionProps {
  onSelectProduct: (product: Product) => void
}

export function MenuSection({ onSelectProduct }: MenuSectionProps) {
  const [active, setActive] = useState<Category>('hamburgueres')
  const filtered = useMemo(() => PRODUCTS.filter((p) => p.category === active), [active])

  return (
    <section id="cardapio" className="bg-paper px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display text-5xl leading-none tracking-wide text-ink sm:text-6xl">CARDÁPIO</h2>
        <p className="mt-3 max-w-md font-body text-sm text-ink/50">
          Tudo sai na hora do pedido. Escolha e finalize pelo WhatsApp.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorias do cardápio">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={active === category.id}
              onClick={() => setActive(category.id)}
              className={`rounded-full border px-4 py-2 font-body text-[13px] font-bold transition-colors ${
                active === category.id
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line text-ink/60 hover:border-ink/40 hover:text-ink'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4 xl:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  )
}
