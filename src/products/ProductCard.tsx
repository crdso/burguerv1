import { Flame, Plus } from 'lucide-react'
import type { Product } from '../types'
import { formatBRL } from '../lib/format'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
  priority?: boolean
}

export function ProductCard({ product, onSelect, priority = false }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-200 hover:border-ink/25">
      <button
        type="button"
        onClick={() => onSelect(product)}
        aria-label={`Ver ${product.name}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-line/40"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-line/40">
            <Flame size={26} strokeWidth={1.2} className="text-ink/15" />
          </span>
        )}

        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-ink px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-paper">
            {product.badge}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-display text-base leading-none tracking-wide text-ink sm:text-lg">{product.name}</h3>
        <p className="line-clamp-2 font-body text-[11px] leading-snug text-ink/70">{product.description}</p>

        {/* Stacks on narrow cards, where a price + button row would clip. */}
        <div className="mt-auto flex flex-col gap-2 pt-2.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-body text-sm font-bold text-ink">{formatBRL(product.price)}</span>
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-2 font-body text-[11px] font-bold uppercase tracking-wider text-paper transition-colors hover:bg-graphite sm:w-auto"
          >
            <Plus size={13} strokeWidth={3} />
            Adicionar
          </button>
        </div>
      </div>
    </article>
  )
}
