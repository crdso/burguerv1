import { useDeferredValue, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { Category, Product } from '../types'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { ProductCard } from '../products/ProductCard'

interface MenuSectionProps {
  onSelectProduct: (product: Product) => void
}

/** Case- and accent-insensitive so "acai"/"jalapeno" match the accented names. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function MenuSection({ onSelectProduct }: MenuSectionProps) {
  const [active, setActive] = useState<Category>('hamburgueres')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const searching = deferredQuery.trim().length > 0

  const filtered = useMemo(() => {
    const term = normalize(deferredQuery.trim())
    // A search looks across the whole menu; categories only filter when idle.
    const base = term ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)
    if (!term) return base
    return base.filter(
      (p) => normalize(p.name).includes(term) || normalize(p.description).includes(term),
    )
  }, [active, deferredQuery])

  return (
    <section id="cardapio" className="bg-paper px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-body text-[11px] font-bold uppercase tracking-widest2 text-flame">O que tem hoje</p>
            <h2 className="mt-2 font-display text-5xl leading-none tracking-wide text-ink sm:text-6xl">
              CARDÁPIO
            </h2>
          </div>

          <label className="relative w-full md:w-72">
            <span className="sr-only">Buscar no cardápio</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar item..."
              className="w-full rounded-full border border-line bg-surface py-2.5 pl-10 pr-9 font-body text-sm text-ink placeholder:text-ink/35 focus:border-ink/40 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-ink/10 hover:text-ink"
              >
                <X size={13} />
              </button>
            )}
          </label>
        </div>

        <div
          className={`mt-7 flex flex-wrap gap-2 transition-opacity ${searching ? 'opacity-40' : ''}`}
          role="tablist"
          aria-label="Categorias do cardápio"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={!searching && active === category.id}
              onClick={() => {
                setQuery('')
                setActive(category.id)
              }}
              className={`rounded-full border px-4 py-2 font-body text-[13px] font-bold transition-colors ${
                !searching && active === category.id
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line text-ink/60 hover:border-ink/40 hover:text-ink'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {searching && (
          <p className="mt-5 font-body text-sm text-ink/55">
            {filtered.length === 0
              ? `Nada encontrado para “${deferredQuery.trim()}”.`
              : `${filtered.length} ${filtered.length === 1 ? 'item' : 'itens'} para “${deferredQuery.trim()}”.`}
          </p>
        )}

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4 2xl:grid-cols-5">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} priority={i < 5} />
          ))}
        </div>

        {filtered.length === 0 && !searching && (
          <p className="mt-8 font-body text-sm text-ink/50">Nenhum item nesta categoria.</p>
        )}
      </div>
    </section>
  )
}
