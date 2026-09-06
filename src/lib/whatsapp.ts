import type { CartItem, CheckoutData } from '../types'
import { getProductById } from '../data/products'
import { formatBRL } from './format'
import { SITE_CONFIG } from '../data/config'

const PAYMENT_LABELS: Record<CheckoutData['payment'], string> = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  debito: 'Débito',
  credito: 'Crédito',
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Mirrors the "0072-1ce8099e" shape the kitchen is used to reading. */
export function generateOrderNumber(): string {
  const counter = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  const suffix = Math.random().toString(16).slice(2, 10).padEnd(8, '0')
  return `${counter}-${suffix}`
}

export function cartSubtotalOf(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}

export function deliveryFeeFor(checkout: Pick<CheckoutData, 'delivery'>): number {
  return checkout.delivery === 'entrega' ? SITE_CONFIG.deliveryFee : 0
}

export function orderTotal(items: CartItem[], checkout: Pick<CheckoutData, 'delivery'>): number {
  return cartSubtotalOf(items) + deliveryFeeFor(checkout)
}

function formatAddress(address: CheckoutData['address']): string {
  const street = [address.street, address.number].filter(Boolean).join(', ')
  const place = [street, address.neighborhood].filter(Boolean).join(', ')
  const city = [SITE_CONFIG.address.city, address.cep].filter(Boolean).join(' - ')
  const base = [place, city].filter(Boolean).join(', ')
  return address.complement ? `${base} / ${address.complement}` : base
}

export function buildWhatsappMessage(
  items: CartItem[],
  checkout: CheckoutData,
  orderNumber: string,
): string {
  const lines: string[] = []

  lines.push(`*NÚMERO DO PEDIDO*: ${orderNumber}`)
  lines.push(`Nome Cardápio: ${SITE_CONFIG.brand}`)
  lines.push(`Nome do cliente: ${checkout.name.trim() || '-'}`)
  if (checkout.phone.trim()) lines.push(`Número do telefone: ${checkout.phone.trim()}`)
  lines.push('Forma de pagamento:')
  lines.push(`- ${PAYMENT_LABELS[checkout.payment]}`)
  if (checkout.payment === 'dinheiro' && checkout.changeFor.trim()) {
    lines.push(`- Troco para: ${checkout.changeFor.trim()}`)
  }
  lines.push(`Tipo de entrega: ${checkout.delivery === 'entrega' ? 'Entrega' : 'Retirada'}`)

  if (checkout.delivery === 'entrega') {
    lines.push(`*Tempo estimado de entrega: ${SITE_CONFIG.estimatedDelivery}*`)
    lines.push(`Endereço para entrega: ${formatAddress(checkout.address)}`)
  } else {
    lines.push(`Retirada no local: ${SITE_CONFIG.address.line1}, ${SITE_CONFIG.address.line2}`)
  }

  lines.push('')
  lines.push('*RESUMO DO PEDIDO*:')

  for (const item of items) {
    const product = getProductById(item.productId)
    if (!product) continue

    lines.push(`👉 ${item.quantity}x ${product.name} ${formatBRL(item.unitPrice * item.quantity)}`)

    const extras = item.selection.extraIds
      .map((id) => product.extras?.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
    const removed = item.selection.removedIds
      .map((id) => product.removables?.find((r) => r.id === id))
      .filter((r): r is NonNullable<typeof r> => Boolean(r))

    if (extras.length || removed.length) {
      lines.push('    *complementos do item:*')
      for (const extra of extras) {
        const label = capitalize(extra.label.replace(/^Adicionar /i, ''))
        lines.push(`        ${item.quantity}x ${label} ${formatBRL(extra.price * item.quantity)}`)
      }
      for (const removable of removed) {
        lines.push(`        ${removable.label}`)
      }
    }

    if (item.selection.note.trim()) {
      lines.push(`    *obs:* ${item.selection.note.trim()}`)
    }
  }

  const subtotal = cartSubtotalOf(items)
  const fee = deliveryFeeFor(checkout)

  lines.push('')
  if (fee > 0) {
    lines.push(`*Subtotal*: ${formatBRL(subtotal)}`)
    lines.push(`*Taxa de entrega*: ${formatBRL(fee)}`)
    lines.push(`*TOTAL*: ${formatBRL(subtotal + fee)}`)
  } else {
    // No flat fee configured: quote it in the conversation, never in the total.
    if (checkout.delivery === 'entrega') lines.push('*Taxa de entrega*: A combinar')
    lines.push(`*TOTAL DOS PRODUTOS*: ${formatBRL(subtotal)}`)
  }

  return lines.join('\n')
}

export function buildWhatsappUrl(message: string): string {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`
}
