import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartItemSelection, Product } from '../types'
import { getProductById } from '../data/products'

function selectionKey(productId: string, selection: CartItemSelection): string {
  const extras = [...selection.extraIds].sort().join(',')
  const removed = [...selection.removedIds].sort().join(',')
  return `${productId}|${extras}|${removed}|${selection.note.trim()}`
}

export function computeUnitPrice(product: Product, selection: CartItemSelection): number {
  const extrasTotal = (product.extras ?? [])
    .filter((extra) => selection.extraIds.includes(extra.id))
    .reduce((sum, extra) => sum + extra.price, 0)
  return product.price + extrasTotal
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  lastAddedKey: string | null
  openCart: () => void
  closeCart: () => void
  addItem: (product: Product, quantity: number, selection: CartItemSelection) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      lastAddedKey: null,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (product, quantity, selection) =>
        set((state) => {
          const key = selectionKey(product.id, selection)
          const unitPrice = computeUnitPrice(product, selection)
          const existing = state.items.find((item) => item.key === key)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
              ),
              lastAddedKey: key,
            }
          }
          const newItem: CartItem = {
            key,
            productId: product.id,
            quantity,
            selection,
            unitPrice,
          }
          return { items: [...state.items, newItem], lastAddedKey: key }
        }),
      removeItem: (key) => set((state) => ({ items: state.items.filter((item) => item.key !== key) })),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.key !== key)
              : state.items.map((item) => (item.key === key ? { ...item, quantity } : item)),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'brasa-burger-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function resolveProduct(item: CartItem) {
  return getProductById(item.productId)
}
