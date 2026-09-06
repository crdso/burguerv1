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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cream/10 bg-charcoal transition-colors duration-200 hover:border-cream/25">
      <button
        type="button"
        onClick={() => onSelect(product)}
        aria-label={`Ver ${product.name}`}
        className="relative block aspect-square w-full overflow-hidden bg-ash"
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
          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ash to-void">
            <Flame size={34} strokeWidth={1.2} className="text-ember/25" />
          </span>
        )}

        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-void/80 px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-ember backdrop-blur-sm">
            {product.badge}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="font-display text-lg leading-none tracking-wide text-cream">{product.name}</h3>
        <p className="line-clamp-2 font-body text-xs leading-relaxed text-cream/50">{product.description}</p>

        {/* Stacks on narrow cards, where a price + button row would clip. */}
        <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-body text-[15px] font-bold text-cream">{formatBRL(product.price)}</span>
          <button
            type="button"
            onClick={() => onSelect(product)}
            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-ember px-3 py-2 font-body text-[11px] font-bold uppercase tracking-wider text-void transition-colors hover:bg-flame sm:w-auto"
          >
            <Plus size={13} strokeWidth={3} />
            Adicionar
          </button>
        </div>
      </div>
    </article>
  )
}
