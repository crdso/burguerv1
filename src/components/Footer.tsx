import { Instagram, MapPin, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '../data/config'

export function Footer() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}`
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-cream/10 bg-void px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-4xl tracking-wide text-cream">{SITE_CONFIG.brand}</p>
          <p className="mt-2 font-body text-sm text-cream/60">{SITE_CONFIG.tagline}</p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Links do rodapé">
          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-body text-sm text-cream/70 hover:text-ember"
          >
            <Instagram size={15} /> Instagram
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-body text-sm text-cream/70 hover:text-ember"
          >
            <MessageCircle size={15} /> WhatsApp
          </a>
          <a
            href={SITE_CONFIG.address.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-body text-sm text-cream/70 hover:text-ember"
          >
            <MapPin size={15} /> Localização
          </a>
        </nav>
      </div>

      <p className="mx-auto mt-10 max-w-[1500px] border-t border-cream/10 pt-6 font-body text-xs text-cream/40">
        © {year} {SITE_CONFIG.brand}. Todos os direitos reservados.
      </p>
    </footer>
  )
}
