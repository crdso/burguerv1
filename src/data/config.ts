/**
 * Edit here to rebrand: WhatsApp number, address, hours, socials, media paths.
 * WhatsApp number must be digits only, with country code (55 = Brasil).
 */
export const SITE_CONFIG = {
  brand: 'RIO HAMBURGUERIA',
  tagline: 'Hambúrguer artesanal, feito na hora.',
  whatsappNumber: '5563999999999',
  instagramHandle: '@riohamburgueria',
  instagramUrl: 'https://instagram.com/riohamburgueria',
  address: {
    line1: 'Av. Principal, 420',
    line2: 'Centro',
    city: 'Araguatins — TO',
    mapsUrl: 'https://maps.google.com/?q=Av.+Principal,+420,+Centro,+Araguatins,+TO',
  },
  hours: [{ days: 'Ter – Dom', time: '18:00 – 23:30' }],
  /** Generated from the untouched `hamburguer.mp4` by `npm run media`. */
  media: {
    scrub: '/media/hamburguer-scrub.mp4',
    scrubMobile: '/media/hamburguer-scrub-mobile.mp4',
    poster: '/media/hamburguer-poster.jpg',
    final: '/media/hamburguer-final.jpg',
  },
} as const
