/**
 * Edit here to rebrand: WhatsApp number, address, hours, socials, media paths.
 * WhatsApp number must be digits only, with country code (55 = Brasil).
 */
export const SITE_CONFIG = {
  brand: 'RIO HAMBURGUERIA',
  tagline: 'Hambúrguer artesanal, feito na hora.',
  whatsappNumber: '5563999999999',
  instagramHandle: '@blackburgerto',
  instagramUrl: 'https://instagram.com/blackburgerto',
  address: {
    line1: 'Av. Principal, 420',
    line2: 'Centro',
    city: 'Araguatins',
    state: 'TO',
    cep: '77950-000',
    mapsUrl: 'https://maps.google.com/?q=Av.+Principal,+420,+Centro,+Araguatins,+TO',
  },
  hours: [
    { days: 'Terça a domingo', time: '18:00 às 23:30' },
    { days: 'Segunda-feira', time: 'Fechado' },
  ],
  /** Flat fee added to delivery orders. Set to 0 to quote it on WhatsApp instead. */
  deliveryFee: 5,
  estimatedDelivery: 'Entre 20 e 60 minutos',
  /** Generated from the untouched `burguer.mp4` by `npm run media`. */
  media: {
    scrub: '/media/hamburguer-scrub.mp4',
    scrubMobile: '/media/hamburguer-scrub-mobile.mp4',
    poster: '/media/hamburguer-poster.jpg',
    final: '/media/hamburguer-final.jpg',
  },
} as const
