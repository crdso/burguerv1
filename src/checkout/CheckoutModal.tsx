import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { CheckoutData } from '../types'
import { useCartStore, cartSubtotal } from '../store/cartStore'
import { buildWhatsappMessage, buildWhatsappUrl } from '../lib/whatsapp'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useEscapeKey } from '../hooks/useEscapeKey'
import { MagneticButton } from '../components/MagneticButton'
import { formatBRL } from '../lib/format'

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
}

const initialData: CheckoutData = {
  name: '',
  phone: '',
  delivery: 'retirada',
  address: { cep: '', street: '', number: '', neighborhood: '', complement: '' },
  payment: 'pix',
  changeFor: '',
}

export function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const [data, setData] = useState<CheckoutData>(initialData)
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const closeCart = useCartStore((s) => s.closeCart)
  const subtotal = cartSubtotal(items)

  useLockBodyScroll(open)
  useEscapeKey(open, onClose)

  function update<K extends keyof CheckoutData>(key: K, value: CheckoutData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function updateAddress<K extends keyof CheckoutData['address']>(key: K, value: string) {
    setData((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const message = buildWhatsappMessage(items, data)
    const url = buildWhatsappUrl(message)
    window.open(url, '_blank', 'noopener,noreferrer')
    clear()
    closeCart()
    onClose()
    setData(initialData)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-void/85 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-charcoal sm:max-h-[88vh] sm:rounded-2xl"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
              <h2 id="checkout-title" className="font-display text-2xl tracking-wide text-cream">
                Finalizar pedido
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-cream/70 hover:bg-cream/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex flex-1 flex-col gap-6 px-6 py-6">
                <div>
                  <label htmlFor="name" className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                    Nome *
                  </label>
                  <input
                    id="name"
                    required
                    value={data.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-cream/15 bg-void/40 px-4 py-3 font-body text-sm text-cream focus:border-ember focus:outline-none"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                    Telefone (opcional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-cream/15 bg-void/40 px-4 py-3 font-body text-sm text-cream focus:border-ember focus:outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <fieldset>
                  <legend className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                    Entrega
                  </legend>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {(['retirada', 'entrega'] as const).map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 font-body text-sm capitalize transition-colors ${
                          data.delivery === option
                            ? 'border-ember bg-ember/15 text-ember'
                            : 'border-cream/15 text-cream/70 hover:border-cream/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={option}
                          checked={data.delivery === option}
                          onChange={() => update('delivery', option)}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {data.delivery === 'entrega' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label htmlFor="cep" className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                        CEP (opcional)
                      </label>
                      <input
                        id="cep"
                        value={data.address.cep}
                        onChange={(e) => updateAddress('cep', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-cream/15 bg-void/40 px-4 py-3 font-body text-sm text-cream focus:border-ember focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="street" className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                        Rua
                      </label>
                      <input
                        id="street"
                        value={data.address.street}
                        onChange={(e) => updateAddress('street', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-cream/15 bg-void/40 px-4 py-3 font-body text-sm text-cream focus:border-ember focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="number" className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                        Número
                      </label>
                      <input
                        id="number"
                        value={data.address.number}
                        onChange={(e) => updateAddress('number', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-cream/15 bg-void/40 px-4 py-3 font-body text-sm text-cream focus:border-ember focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="neighborhood" className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                        Bairro
                      </label>
                      <input
                        id="neighborhood"
                        value={data.address.neighborhood}
                        onChange={(e) => updateAddress('neighborhood', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-cream/15 bg-void/40 px-4 py-3 font-body text-sm text-cream focus:border-ember focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="complement" className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                        Complemento
                      </label>
                      <input
                        id="complement"
                        value={data.address.complement}
                        onChange={(e) => updateAddress('complement', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-cream/15 bg-void/40 px-4 py-3 font-body text-sm text-cream focus:border-ember focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <fieldset>
                  <legend className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                    Forma de pagamento
                  </legend>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {(
                      [
                        { id: 'pix', label: 'Pix' },
                        { id: 'dinheiro', label: 'Dinheiro' },
                        { id: 'cartao', label: 'Cartão' },
                      ] as const
                    ).map((option) => (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-3 font-body text-sm transition-colors ${
                          data.payment === option.id
                            ? 'border-ember bg-ember/15 text-ember'
                            : 'border-cream/15 text-cream/70 hover:border-cream/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={option.id}
                          checked={data.payment === option.id}
                          onChange={() => update('payment', option.id)}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {data.payment === 'dinheiro' && (
                  <div>
                    <label htmlFor="changeFor" className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">
                      Troco para quanto?
                    </label>
                    <input
                      id="changeFor"
                      value={data.changeFor}
                      onChange={(e) => update('changeFor', e.target.value)}
                      placeholder="Ex: R$ 50,00"
                      className="mt-2 w-full rounded-lg border border-cream/15 bg-void/40 px-4 py-3 font-body text-sm text-cream focus:border-ember focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-cream/10 px-6 py-5">
                <div className="mb-4 flex items-center justify-between font-body text-sm text-cream/60">
                  <span>Subtotal do pedido</span>
                  <span className="font-display text-xl text-ember">{formatBRL(subtotal)}</span>
                </div>
                <MagneticButton type="submit" variant="solid" className="w-full">
                  Finalizar no WhatsApp
                </MagneticButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
