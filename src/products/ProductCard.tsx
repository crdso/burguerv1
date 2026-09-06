import { Flame, Plus } from 'lucide-react'
import type { Product } from '../types'
import { formatBRL } from '../lib/format'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
  priority?: boolean
}

export function ProductCard({ product, onSelect, priority = false }: ProductCardProps) {
  const isSoldOut = product.badge === 'Esgotado'
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-xl border bg-surface transition-colors duration-200 ${isSoldOut ? 'border-line opacity-85' : 'border-line hover:border-ink/25'}`}
    >
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
            <Flame size={20} strokeWidth={1.2} className="text-ink/15" />
          </span>
        )}

        {product.badge && (
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 font-body text-[9px] font-bold uppercase tracking-wider ${isSoldOut ? 'bg-red-600 text-white' : 'bg-ink text-paper'}`}
          >
            {product.badge}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-0.5 p-2 sm:p-2.5">
        <h3 className="line-clamp-1 font-display text-[13px] leading-none tracking-wide text-ink sm:text-[13px]">
          {product.name}
        </h3>
        <p className="line-clamp-2 min-h-[28px] font-body text-[10px] leading-snug text-ink/60">
          {product.description || '\u00A0'}
        </p>

        <div className="mt-auto flex items-center justify-between gap-1.5 pt-2">
          <span className="font-body text-[12px] font-bold leading-none text-ink">{formatBRL(product.price)}</span>
          <button
            type="button"
            onClick={() => onSelect(product)}
            disabled={isSoldOut}
            className={`flex h-7 shrink-0 items-center justify-center gap-1 rounded-full px-2.5 font-body text-[10px] font-bold uppercase tracking-wider transition-colors ${isSoldOut ? 'cursor-not-allowed bg-line text-ink/40' : 'bg-ink text-paper hover:bg-graphite'}`}
          >
            {!isSoldOut && <Plus size={11} strokeWidth={3} />}
            {isSoldOut ? 'Esgotado' : 'Adicionar'}
          </button>
        </div>
      </div>
    </article>
  )
}
