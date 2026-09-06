import { Instagram, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '../data/config'

export function Footer() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}`
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-cream/10 bg-void px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-2xl tracking-wide text-cream">{SITE_CONFIG.brand}</p>

        <nav className="flex gap-6" aria-label="Links do rodapé">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-body text-sm text-cream/60 transition-colors hover:text-cream"
          >
            <MessageCircle size={15} /> WhatsApp
          </a>
          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-body text-sm text-cream/60 transition-colors hover:text-cream"
          >
            <Instagram size={15} /> Instagram
          </a>
        </nav>

        <p className="font-body text-xs text-cream/35">
          © {year} {SITE_CONFIG.brand}
        </p>
      </div>
    </footer>
  )
}
