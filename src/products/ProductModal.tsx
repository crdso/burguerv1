import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Minus, Plus, X } from 'lucide-react'
import type { CartItemSelection, Product } from '../types'
import { formatBRL } from '../lib/format'
import { useCartStore, computeUnitPrice } from '../store/cartStore'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useEscapeKey } from '../hooks/useEscapeKey'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [extraIds, setExtraIds] = useState<string[]>([])
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const [note, setNote] = useState('')
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  useLockBodyScroll(Boolean(product))
  useEscapeKey(Boolean(product), onClose)

  useEffect(() => {
    setQuantity(1)
    setExtraIds([])
    setRemovedIds([])
    setNote('')
  }, [product?.id])

  const selection: CartItemSelection = useMemo(
    () => ({ extraIds, removedIds, note }),
    [extraIds, removedIds, note],
  )

  const unitPrice = product ? computeUnitPrice(product, selection) : 0
  const total = unitPrice * quantity

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((v) => v !== id) : [...list, id])
  }

  function handleAdd() {
    if (!product) return
    addItem(product, quantity, selection)
    onClose()
    openCart()
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-charcoal sm:max-h-[80vh] sm:rounded-2xl"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-start gap-3 border-b border-cream/10 p-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-ash">
                {product.image ? (
                  <img src={product.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ash to-void">
                    <Flame size={20} strokeWidth={1.2} className="text-ember/30" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 id="product-modal-title" className="font-display text-2xl leading-none tracking-wide text-cream">
                  {product.name}
                </h2>
                <p className="mt-1.5 font-body text-xs leading-relaxed text-cream/50">{product.description}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="-mr-1 -mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {product.extras && product.extras.length > 0 && (
                <fieldset>
                  <legend className="font-body text-[11px] font-bold uppercase tracking-widest2 text-cream/40">
                    Adicionais
                  </legend>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {product.extras.map((extra) => (
                      <label
                        key={extra.id}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-cream/10 px-3 py-2.5 transition-colors hover:border-cream/25"
                      >
                        <span className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={extraIds.includes(extra.id)}
                            onChange={() => toggle(extraIds, setExtraIds, extra.id)}
                            className="h-3.5 w-3.5 accent-ember"
                          />
                          <span className="font-body text-[13px] text-cream">{extra.label}</span>
                        </span>
                        <span className="font-body text-[13px] text-cream/50">+ {formatBRL(extra.price)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {product.removables && product.removables.length > 0 && (
                <fieldset className="mt-4">
                  <legend className="font-body text-[11px] font-bold uppercase tracking-widest2 text-cream/40">
                    Preferências
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {product.removables.map((removable) => {
                      const active = removedIds.includes(removable.id)
                      return (
                        <button
                          key={removable.id}
                          type="button"
                          onClick={() => toggle(removedIds, setRemovedIds, removable.id)}
                          className={`rounded-full border px-3 py-1.5 font-body text-[12px] font-semibold transition-colors ${
                            active
                              ? 'border-ember bg-ember/15 text-ember'
                              : 'border-cream/15 text-cream/60 hover:border-cream/40'
                          }`}
                        >
                          {removable.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              <div className="mt-4">
                <label
                  htmlFor="product-note"
                  className="font-body text-[11px] font-bold uppercase tracking-widest2 text-cream/40"
                >
                  Observação
                </label>
                <textarea
                  id="product-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: ponto da carne, tirar ingrediente..."
                  rows={2}
                  className="mt-2 w-full resize-none rounded-lg border border-cream/10 bg-void/40 px-3 py-2.5 font-body text-[13px] text-cream placeholder:text-cream/25 focus:border-ember focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-cream/10 p-4">
              <div className="flex items-center gap-2 rounded-full border border-cream/15 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Diminuir quantidade"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="w-4 text-center font-body text-sm font-bold text-cream">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Aumentar quantidade"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex flex-1 items-center justify-between gap-2 rounded-full bg-ember px-5 py-3 font-body text-[13px] font-bold uppercase tracking-wider text-void transition-colors hover:bg-flame"
              >
                <span>Adicionar</span>
                <span>{formatBRL(total)}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
