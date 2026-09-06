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

  useEffect(() => {
    setQuantity(1)
    setExtraIds([])
    setRemovedIds([])
    setNote('')
  }, [product?.id])

  useEscapeKey(Boolean(product), onClose)

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
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-void/85 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-charcoal sm:max-h-[85vh] sm:flex-row sm:rounded-2xl"
            variants={{
              hidden: { y: '100%', opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-void/70 text-cream backdrop-blur-sm sm:right-5 sm:top-5"
            >
              <X size={18} />
            </button>

            <div className="relative h-52 w-full flex-shrink-0 bg-ash sm:h-auto sm:w-2/5">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ash via-charcoal to-void">
                  <Flame size={64} strokeWidth={1} className="text-ember/25" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent sm:bg-gradient-to-r" />
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
              {product.badge && (
                <span className="mb-2 inline-block w-fit rounded-full bg-brasa/20 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-ember">
                  {product.badge}
                </span>
              )}
              <h2 id="product-modal-title" className="font-display text-4xl tracking-wide text-cream sm:text-5xl">
                {product.name}
              </h2>
              <p className="mt-3 font-body text-sm text-cream/60 sm:text-base">{product.description}</p>

              {product.extras && product.extras.length > 0 && (
                <fieldset className="mt-6">
                  <legend className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                    Adicionais
                  </legend>
                  <div className="mt-3 flex flex-col gap-2">
                    {product.extras.map((extra) => (
                      <label
                        key={extra.id}
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-cream/10 px-4 py-3 transition-colors hover:border-ember/40"
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={extraIds.includes(extra.id)}
                            onChange={() => toggle(extraIds, setExtraIds, extra.id)}
                            className="h-4 w-4 accent-ember"
                          />
                          <span className="font-body text-sm text-cream">{extra.label}</span>
                        </span>
                        <span className="font-body text-sm text-cream/60">+ {formatBRL(extra.price)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {product.removables && product.removables.length > 0 && (
                <fieldset className="mt-6">
                  <legend className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                    Preferências
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.removables.map((removable) => {
                      const active = removedIds.includes(removable.id)
                      return (
                        <button
                          key={removable.id}
                          type="button"
                          onClick={() => toggle(removedIds, setRemovedIds, removable.id)}
                          className={`rounded-full border px-4 py-2 font-body text-sm transition-colors ${
                            active
                              ? 'border-ember bg-ember/15 text-ember'
                              : 'border-cream/15 text-cream/70 hover:border-cream/40'
                          }`}
                        >
                          {removable.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              <div className="mt-6">
                <label htmlFor="product-note" className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                  Observação
                </label>
                <textarea
                  id="product-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: ponto da carne, tirar ingrediente..."
                  rows={2}
                  className="mt-3 w-full resize-none rounded-lg border border-cream/10 bg-void/40 px-4 py-3 font-body text-sm text-cream placeholder:text-cream/30 focus:border-ember focus:outline-none"
                />
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-cream/10 pt-6">
                <div className="flex items-center gap-4 rounded-full border border-cream/15 px-2 py-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Diminuir quantidade"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-5 text-center font-body font-semibold text-cream">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Aumentar quantidade"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="mt-4 flex w-full items-center justify-between rounded-full bg-ember px-7 py-4 font-body text-sm font-bold uppercase tracking-widest text-void transition-colors hover:bg-brasa"
              >
                <span>Adicionar ao pedido</span>
                <span>{formatBRL(total)}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
