import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { CheckoutData } from '../types'
import { useCartStore, cartSubtotal } from '../store/cartStore'
import {
  buildWhatsappMessage,
  buildWhatsappUrl,
  deliveryFeeFor,
  generateOrderNumber,
} from '../lib/whatsapp'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { useEscapeKey } from '../hooks/useEscapeKey'
import { Button } from '../components/Button'
import { formatBRL } from '../lib/format'
import { SITE_CONFIG } from '../data/config'

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
  const fee = deliveryFeeFor(data)
  const total = subtotal + fee

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
    const message = buildWhatsappMessage(items, data, generateOrderNumber())
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
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface sm:max-h-[88vh] sm:rounded-2xl"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <p className="mb-1 font-body text-[10px] font-bold tracking-widest text-ink/60">{SITE_CONFIG.brand}</p>
                <h2 id="checkout-title" className="font-display text-2xl tracking-wide text-ink">
                  Finalizar pedido
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink/70 hover:bg-graphite/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex flex-1 flex-col gap-6 px-6 py-6">
                <div>
                  <label htmlFor="name" className="font-body text-xs font-semibold uppercase tracking-widest2 text-ink/50">
                    Nome *
                  </label>
                  <input
                    id="name"
                    required
                    value={data.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="font-body text-xs font-semibold uppercase tracking-widest2 text-ink/50">
                    Telefone (opcional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <fieldset>
                  <legend className="font-body text-xs font-semibold uppercase tracking-widest2 text-ink/50">
                    Entrega
                  </legend>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {(['retirada', 'entrega'] as const).map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 font-body text-sm capitalize transition-colors ${
                          data.delivery === option
                            ? 'border-ink bg-ink/5 text-ink'
                            : 'border-line text-ink/70 hover:border-ink/40'
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
                      <label htmlFor="cep" className="font-body text-xs font-semibold uppercase tracking-widest2 text-ink/50">
                        CEP (opcional)
                      </label>
                      <input
                        id="cep"
                        value={data.address.cep}
                        onChange={(e) => updateAddress('cep', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="street" className="font-body text-xs font-semibold uppercase tracking-widest2 text-ink/50">
                        Rua
                      </label>
                      <input
                        id="street"
                        value={data.address.street}
                        onChange={(e) => updateAddress('street', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="number" className="font-body text-xs font-semibold uppercase tracking-widest2 text-ink/50">
                        Número
                      </label>
                      <input
                        id="number"
                        value={data.address.number}
                        onChange={(e) => updateAddress('number', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="neighborhood" className="font-body text-xs font-semibold uppercase tracking-widest2 text-ink/50">
                        Bairro
                      </label>
                      <input
                        id="neighborhood"
                        value={data.address.neighborhood}
                        onChange={(e) => updateAddress('neighborhood', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="complement" className="font-body text-xs font-semibold uppercase tracking-widest2 text-ink/50">
                        Complemento
                      </label>
                      <input
                        id="complement"
                        value={data.address.complement}
                        onChange={(e) => updateAddress('complement', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <fieldset>
                  <legend className="font-body text-xs font-semibold uppercase tracking-widest2 text-ink/50">
                    Forma de pagamento
                  </legend>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {(
                      [
                        { id: 'pix', label: 'Pix' },
                        { id: 'dinheiro', label: 'Dinheiro' },
                        { id: 'debito', label: 'Débito' },
                        { id: 'credito', label: 'Crédito' },
                      ] as const
                    ).map((option) => (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-3 font-body text-sm transition-colors ${
                          data.payment === option.id
                            ? 'border-ink bg-ink/5 text-ink'
                            : 'border-line text-ink/70 hover:border-ink/40'
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
                    <label htmlFor="changeFor" className="font-body text-xs font-semibold uppercase tracking-widest2 text-ink/50">
                      Troco para quanto?
                    </label>
                    <input
                      id="changeFor"
                      value={data.changeFor}
                      onChange={(e) => update('changeFor', e.target.value)}
                      placeholder="Ex: R$ 50,00"
                      className="mt-2 w-full rounded-lg border border-line bg-paper px-4 py-3 font-body text-sm text-ink focus:border-ink focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-line px-6 py-5">
                <dl className="mb-4 flex flex-col gap-1.5 font-body text-sm">
                  {fee > 0 && (
                    <div className="flex items-center justify-between text-ink/60">
                      <dt>Subtotal</dt>
                      <dd>{formatBRL(subtotal)}</dd>
                    </div>
                  )}
                  {data.delivery === 'entrega' && (
                    <div className="flex items-center justify-between text-ink/60">
                      <dt>Taxa de entrega</dt>
                      <dd>{fee > 0 ? formatBRL(fee) : 'A combinar'}</dd>
                    </div>
                  )}
                  <div className="mt-1 flex items-center justify-between border-t border-line pt-2.5">
                    <dt className="font-display text-lg tracking-wide text-ink">
                      {fee > 0 ? 'Total' : 'Total dos produtos'}
                    </dt>
                    <dd className="font-display text-2xl text-ink">{formatBRL(total)}</dd>
                  </div>
                </dl>
                <Button type="submit" variant="solid" className="w-full">
                  Finalizar no WhatsApp
                </Button>
                <p className="mt-3 text-center font-body text-[11px] text-ink/45">
                  Abre o WhatsApp com o pedido pronto. Você confere e envia.
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
