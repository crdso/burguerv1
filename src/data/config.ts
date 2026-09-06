/**
 * Edit here to rebrand: WhatsApp number, address, hours, socials.
 * WhatsApp number must be digits only, with country code (55 = Brasil).
 */
export const SITE_CONFIG = {
  brand: 'BRASA BURGER',
  slogan: 'Fogo. Carne. Respeito.',
  whatsappNumber: '5563999999999',
  instagramHandle: '@brasaburger',
  instagramUrl: 'https://instagram.com/brasaburger',
  address: {
    line1: 'Av. Principal, 420',
    line2: 'Centro',
    city: 'Araguatins — TO',
    mapsUrl: 'https://maps.google.com/?q=Av.+Principal,+420,+Centro,+Araguatins,+TO',
  },
  hours: [{ days: 'Ter – Dom', time: '18:00 – 23:30' }],
} as const
