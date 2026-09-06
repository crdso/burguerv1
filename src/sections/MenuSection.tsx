import { useDeferredValue, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { Category, Product } from '../types'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { SITE_CONFIG } from '../data/config'
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

  const categoryLabelMap = useMemo(() => {
    const map = new Map<Category, string>()
    for (const c of CATEGORIES) map.set(c.id, c.label)
    return map
  }, [])

  const filtered = useMemo(() => {
    const term = normalize(deferredQuery.trim())
    // A search looks across the whole menu; categories only filter when idle.
    const base = term ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)
    if (!term) return base
    return base.filter(
      (p) =>
        normalize(p.name).includes(term) ||
        normalize(p.description).includes(term) ||
        normalize(p.category).includes(term) ||
        normalize(categoryLabelMap.get(p.category) ?? '').includes(term),
    )
  }, [active, deferredQuery, categoryLabelMap])

  return (
    <section id="cardapio" aria-label={`Cardápio ${SITE_CONFIG.brand}`} className="bg-paper px-3 py-10 sm:px-6 sm:py-12 lg:px-8">
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
          className={`mt-5 flex flex-wrap gap-1.5 transition-opacity sm:gap-2 ${searching ? 'opacity-40' : ''}`}
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
              className={`rounded-full border px-3 py-1.5 font-body text-[12px] font-bold transition-colors sm:px-3.5 sm:py-2 sm:text-[12px] ${
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

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3 xl:grid-cols-5 2xl:grid-cols-5">
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
