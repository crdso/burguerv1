import { useState } from 'react'
import type { Product } from './types'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Marquee } from './components/Marquee'
import { ScrollProgress } from './components/ScrollProgress'
import { Hero } from './sections/Hero'
import { ScrollStory } from './sections/ScrollStory'
import { MenuTransition } from './sections/MenuTransition'
import { FireSection } from './sections/FireSection'
import { MenuSection } from './sections/MenuSection'
import { ComboSection } from './sections/ComboSection'
import { Testimonials } from './sections/Testimonials'
import { InstagramSection } from './sections/InstagramSection'
import { LocationSection } from './sections/LocationSection'
import { ProductModal } from './products/ProductModal'
import { CartDrawer } from './cart/CartDrawer'
import { CheckoutModal } from './checkout/CheckoutModal'

const MARQUEE_ITEMS = ['BRASA', 'SMASH', 'CHEDDAR', 'BACON', 'FOGO']

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <>
      <ScrollProgress />
      <Header />

      <main>
        <Hero />
        <ScrollStory />
        <MenuTransition />
        <Marquee items={MARQUEE_ITEMS} />
        <FireSection />
        <Marquee items={MARQUEE_ITEMS} reverse />
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

      <div className="grain-overlay bg-grain" />
    </>
  )
}
