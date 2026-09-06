import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { SITE_CONFIG } from '../data/config'
import { useCartStore, cartItemCount } from '../store/cartStore'

const NAV_LINKS = [
  { href: '#top', label: 'Início' },
  { href: '#cardapio', label: 'Cardápio' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
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
      className={`fixed inset-x-0 top-0 z-40 h-[var(--header-h)] transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_0_rgba(20,17,15,0.08)]' : ''
      }`}
      style={{ backgroundColor: 'var(--page)' }}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <a href="#top" className="font-display text-xl tracking-wide text-ink sm:text-2xl">
          {SITE_CONFIG.brand}
        </a>

        <nav className="flex items-center gap-5 sm:gap-7" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-[13px] font-semibold text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}

          <button
            type="button"
            onClick={openCart}
            aria-label={`Pedir agora, ${count} ${count === 1 ? 'item' : 'itens'} no carrinho`}
            className="relative flex items-center gap-2 rounded-full bg-flame px-4 py-2 font-body text-[13px] font-bold text-paper transition-colors hover:bg-ink"
          >
            <ShoppingBag size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">Pedir agora</span>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-paper px-1 font-body text-[11px] font-bold text-ink">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
