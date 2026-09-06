import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Minus, Pencil, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import type { Product } from '../types'
import { cartSubtotal, resolveProduct, useCartStore } from '../store/cartStore'
import { formatBRL } from '../lib/format'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useEscapeKey } from '../hooks/useEscapeKey'
import { Button } from '../components/Button'

interface CartDrawerProps {
  onCheckout: () => void
  onEditProduct: (product: Product) => void
}

export function CartDrawer({ onCheckout, onEditProduct }: CartDrawerProps) {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const isDesktop = useMediaQuery('(min-width: 640px)')

  useLockBodyScroll(isOpen)
  useEscapeKey(isOpen, closeCart)

  const subtotal = cartSubtotal(items)

  const panelVariants = isDesktop
    ? {
        hidden: { x: '100%' },
        visible: { x: 0 },
      }
    : {
        hidden: { y: '100%' },
        visible: { y: 0 },
      }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Fechar carrinho"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Seu pedido"
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-surface sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-h-none sm:w-full sm:max-w-md sm:rounded-none sm:rounded-l-3xl"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="flex items-center gap-2 font-display text-2xl tracking-wide text-ink">
                <ShoppingBag size={20} className="text-flame" /> Seu pedido
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink/70 hover:bg-ink/5 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
                  <Flame size={40} strokeWidth={1} className="text-ink/15" />
                  <p className="font-body text-sm text-ink/50">Seu carrinho está vazio.</p>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-line">
                  {items.map((item) => {
                    const product = resolveProduct(item)
                    if (!product) return null
                    return (
                      <li key={item.key} className="flex gap-4 py-5">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-line/40">
                          {product.image ? (
                            <img src={product.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-line/40">
                              <Flame size={22} strokeWidth={1} className="text-ink/15" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-display text-lg leading-tight tracking-wide text-ink">
                              {product.name}
                            </p>
                            <p className="font-body text-sm font-bold text-flame">
                              {formatBRL(item.unitPrice * item.quantity)}
                            </p>
                          </div>

                          {(item.selection.extraIds.length > 0 || item.selection.removedIds.length > 0) && (
                            <p className="mt-1 font-body text-xs text-ink/50">
                              {item.selection.extraIds
                                .map((id) => product.extras?.find((e) => e.id === id)?.label)
                                .filter(Boolean)
                                .join(' · ')}
                              {item.selection.extraIds.length > 0 && item.selection.removedIds.length > 0 ? ' · ' : ''}
                              {item.selection.removedIds
                                .map((id) => product.removables?.find((r) => r.id === id)?.label)
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                          )}

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 rounded-full border border-line px-1.5 py-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                aria-label="Diminuir quantidade"
                                className="flex h-6 w-6 items-center justify-center rounded-full text-ink hover:bg-ink/5"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-4 text-center font-body text-sm text-ink">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                aria-label="Aumentar quantidade"
                                className="flex h-6 w-6 items-center justify-center rounded-full text-ink hover:bg-ink/5"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  removeItem(item.key)
                                  onEditProduct(product)
                                }}
                                aria-label={`Editar ${product.name}`}
                                className="flex items-center gap-1 font-body text-xs text-ink/50 hover:text-flame"
                              >
                                <Pencil size={12} /> editar
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(item.key)}
                                aria-label={`Remover ${product.name}`}
                                className="flex items-center gap-1 font-body text-xs text-ink/50 hover:text-flame"
                              >
                                <Trash2 size={12} /> remover
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <div className="flex items-center justify-between font-body text-sm text-ink/70">
                  <span>Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between font-body text-xs text-ink/45">
                  <span>Taxa de entrega</span>
                  <span>calculada pelo WhatsApp</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <span className="font-display text-xl text-ink">Total parcial</span>
                  <span className="font-display text-2xl text-flame">{formatBRL(subtotal)}</span>
                </div>

                <Button variant="solid" className="mt-5 w-full" onClick={onCheckout}>
                  Finalizar no WhatsApp
                </Button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
