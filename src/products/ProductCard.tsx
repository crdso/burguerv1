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
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group relative flex w-full flex-col overflow-hidden rounded-[2px] bg-charcoal text-left transition-transform duration-500 hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ash">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ash via-charcoal to-void">
            <Flame
              size={72}
              strokeWidth={1}
              className="text-ember/25 transition-transform duration-700 group-hover:scale-110"
            />
            <span className="absolute bottom-3 left-3 font-body text-[10px] uppercase tracking-widest2 text-cream/30">
              Foto em breve
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-90" />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brasa/90 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-cream">
            {product.badge}
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-void opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Plus size={18} strokeWidth={2.5} />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-1 py-4">
        <h3 className="font-display text-2xl tracking-wide text-cream">{product.name}</h3>
        <p className="line-clamp-2 font-body text-sm text-cream/60">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-body text-lg font-bold text-ember">{formatBRL(product.price)}</span>
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-cream/50 underline decoration-cream/20 underline-offset-4 group-hover:text-ember group-hover:decoration-ember">
            Adicionar
          </span>
        </div>
      </div>
    </button>
  )
}
