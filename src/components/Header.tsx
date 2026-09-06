import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { SITE_CONFIG } from '../data/config'
import { useCartStore, cartItemCount } from '../store/cartStore'

const NAV_LINKS = [
  { href: '#cardapio', label: 'Cardápio' },
  { href: '#fogo', label: 'O Fogo' },
  { href: '#combo', label: 'Combo' },
  { href: '#local', label: 'Onde Estamos' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const items = useCartStore((s) => s.items)
  const openCart = useCartStore((s) => s.openCart)
  const count = cartItemCount(items)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-void/90 backdrop-blur-md shadow-[0_1px_0_rgba(242,230,210,0.08)]' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1800px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <a href="#top" className="font-display text-2xl tracking-wide text-cream sm:text-3xl">
          {SITE_CONFIG.brand}
        </a>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative font-body text-sm font-medium uppercase tracking-wider text-cream/80 transition-colors hover:text-cream"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream transition-colors hover:border-ember hover:text-ember"
          >
            <ShoppingBag size={19} strokeWidth={1.75} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brasa px-1 font-body text-[11px] font-bold text-cream"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream lg:hidden"
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-void/95 backdrop-blur-md lg:hidden"
            aria-label="Navegação móvel"
          >
            <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-cream/10 py-4 font-display text-2xl tracking-wide text-cream/90"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
