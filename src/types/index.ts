export type Category =
  | 'smash'
  | 'classicos'
  | 'especiais'
  | 'combos'
  | 'acompanhamentos'
  | 'bebidas'

export interface ProductExtra {
  id: string
  label: string
  price: number
}

export interface ProductRemovable {
  id: string
  label: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: Category
  image?: string
  imagePlaceholder?: boolean
  badge?: string
  extras?: ProductExtra[]
  removables?: ProductRemovable[]
  featured?: boolean
}

export interface CartItemSelection {
  extraIds: string[]
  removedIds: string[]
  note: string
}

export interface CartItem {
  key: string
  productId: string
  quantity: number
  selection: CartItemSelection
  unitPrice: number
}

export type DeliveryMethod = 'retirada' | 'entrega'
export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao'

export interface CheckoutData {
  name: string
  phone: string
  delivery: DeliveryMethod
  address: {
    cep: string
    street: string
    number: string
    neighborhood: string
    complement: string
  }
  payment: PaymentMethod
  changeFor: string
}
