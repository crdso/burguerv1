import type { CartItem, CheckoutData } from '../types'
import { getProductById } from '../data/products'
import { formatBRL } from './format'
import { SITE_CONFIG } from '../data/config'

const PAYMENT_LABELS: Record<CheckoutData['payment'], string> = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  cartao: 'Cartão na entrega',
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function buildWhatsappMessage(items: CartItem[], checkout: CheckoutData): string {
  const lines: string[] = []

  lines.push(`Olá! Quero fazer um pedido na ${SITE_CONFIG.brand} 🍔`)
  lines.push('')
  lines.push('*PEDIDO*')
  lines.push('')

  for (const item of items) {
    const product = getProductById(item.productId)
    if (!product) continue

    const itemTotal = item.unitPrice * item.quantity
    lines.push(`${item.quantity}x ${product.name}`)

    for (const extraId of item.selection.extraIds) {
      const extra = product.extras?.find((e) => e.id === extraId)
      if (extra) lines.push(`- + ${capitalize(extra.label.replace(/^Adicionar /i, ''))}`)
    }
    for (const removedId of item.selection.removedIds) {
      const removable = product.removables?.find((r) => r.id === removedId)
      if (removable) lines.push(`- ${removable.label}`)
    }
    if (item.selection.note.trim()) {
      lines.push(`- Obs: ${item.selection.note.trim()}`)
    }
    lines.push(formatBRL(itemTotal))
    lines.push('')
  }

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  lines.push(`*Subtotal: ${formatBRL(subtotal)}*`)
  lines.push('')

  lines.push('Meu nome:')
  lines.push(checkout.name || '-')
  lines.push('')

  if (checkout.phone.trim()) {
    lines.push('Telefone:')
    lines.push(checkout.phone.trim())
    lines.push('')
  }

  lines.push('Forma de entrega:')
  lines.push(checkout.delivery === 'entrega' ? 'Entrega' : 'Retirada')
  lines.push('')

  if (checkout.delivery === 'entrega') {
    const { street, number, neighborhood, complement, cep } = checkout.address
    lines.push('Endereço:')
    lines.push(
      [street, number].filter(Boolean).join(', ') ||
        '-',
    )
    if (neighborhood) lines.push(neighborhood)
    if (complement) lines.push(complement)
    if (cep) lines.push(`CEP: ${cep}`)
    lines.push('')
  }

  lines.push('Forma de pagamento:')
  lines.push(PAYMENT_LABELS[checkout.payment])
  if (checkout.payment === 'dinheiro' && checkout.changeFor.trim()) {
    lines.push(`Troco para: ${checkout.changeFor.trim()}`)
  }
  lines.push('')
  lines.push('Taxa de entrega: a calcular')

  return lines.join('\n')
}

export function buildWhatsappUrl(message: string): string {
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`
}
