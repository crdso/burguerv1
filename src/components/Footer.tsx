import { Clock, Instagram, MapPin, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '../data/config'

export function Footer() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}`
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-paper px-5 pb-8 pt-14 text-ink sm:px-8 sm:pt-16 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 border-b border-line pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <img
              src={SITE_CONFIG.brandLogo}
              alt={SITE_CONFIG.brand}
              width="938"
              height="938"
              className="h-36 w-auto object-contain object-left"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = SITE_CONFIG.brandLogoFallback
              }}
            />
            <p className="mt-3 max-w-[24ch] font-body text-sm text-ink/65">{SITE_CONFIG.tagline}</p>
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-widest2 text-ink">
              <Clock size={13} /> Horário
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {SITE_CONFIG.hours.map((h) => (
                <li key={h.days} className="font-body text-sm text-ink/75">
                  {h.days}
                  <span className="block text-ink/50">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-widest2 text-ink">
              <MapPin size={13} /> Endereço
            </h2>
            <address className="mt-3 not-italic font-body text-sm leading-relaxed text-ink/75">
              {SITE_CONFIG.address.line1}
              <br />
              {SITE_CONFIG.address.line2}
              <br />
              {SITE_CONFIG.address.city} — {SITE_CONFIG.address.state}
            </address>
            <a
              href={SITE_CONFIG.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-body text-sm text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
            >
              Como chegar
            </a>
          </div>

          <div>
            <h2 className="font-body text-[11px] font-bold uppercase tracking-widest2 text-ink">Pedidos</h2>
            <div className="mt-3 flex flex-col gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-body text-sm font-bold text-paper transition-colors hover:bg-graphite"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 font-body text-sm text-ink/75 transition-colors hover:text-ink"
              >
                <Instagram size={15} /> {SITE_CONFIG.instagramHandle}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-ink/55">
            © {year} {SITE_CONFIG.brand}. Todos os direitos reservados.
          </p>
          <p className="font-body text-xs text-ink/45">
            Imagens meramente ilustrativas.
          </p>
        </div>
      </div>
    </footer>
  )
}
