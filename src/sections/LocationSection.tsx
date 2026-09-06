import { Clock, MapPin } from 'lucide-react'
import { SectionLabel } from '../components/SectionLabel'
import { Button } from '../components/Button'
import { SITE_CONFIG } from '../data/config'

export function LocationSection() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}`

  return (
    <section id="local" className="relative overflow-hidden bg-void px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="relative mx-auto max-w-[1400px]">
        <SectionLabel index="05" label="Localização" />
        <h2 className="mt-6 font-display text-6xl leading-[0.9] text-cream sm:text-7xl lg:text-8xl">
          ONDE A GENTE
          <br />
          <span className="text-ember">TÁ.</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-cream/10 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex gap-4">
            <MapPin className="mt-1 shrink-0 text-ember" size={22} />
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">Endereço</p>
              <p className="mt-2 font-display text-2xl text-cream">{SITE_CONFIG.address.line1}</p>
              <p className="font-body text-cream/70">{SITE_CONFIG.address.line2}</p>
              <p className="font-body text-cream/70">{SITE_CONFIG.address.city}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Clock className="mt-1 shrink-0 text-ember" size={22} />
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-widest2 text-cream/50">Horário</p>
              {SITE_CONFIG.hours.map((h) => (
                <p key={h.days} className="mt-2 font-display text-2xl text-cream">
                  {h.days} <span className="text-cream/60">{h.time}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-4 sm:col-span-2 lg:col-span-1 lg:justify-end">
            <a href={SITE_CONFIG.address.mapsUrl} target="_blank" rel="noreferrer">
              <Button variant="outline">Como chegar</Button>
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <Button variant="solid">WhatsApp</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
