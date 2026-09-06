import { useState } from 'react'
import type { Product } from './types'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { BurgerScrub } from './sections/BurgerScrub'
import { MenuSection } from './sections/MenuSection'
import { ComboSection } from './sections/ComboSection'
import { Testimonials } from './sections/Testimonials'
import { InstagramSection } from './sections/InstagramSection'
import { LocationSection } from './sections/LocationSection'
import { ProductModal } from './products/ProductModal'
import { CartDrawer } from './cart/CartDrawer'
import { CheckoutModal } from './checkout/CheckoutModal'

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <>
      <Header />

      <main>
        <BurgerScrub />
        <MenuSection onSelectProduct={setSelectedProduct} />
        <ComboSection onSelect={setSelectedProduct} />
        <Testimonials />
        <InstagramSection />
        <LocationSection />
      </main>

      <Footer />

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} onEditProduct={setSelectedProduct} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  )
}
