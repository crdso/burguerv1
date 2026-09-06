import type { Category, Product, ProductExtra, ProductRemovable } from '../types'
import burgerBacon from '../assets/photos/burger-bacon.jpg'
import burgerClassic from '../assets/photos/burger-classic.jpg'

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'hamburgueres', label: 'Hambúrgueres' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'acompanhamentos', label: 'Acompanhamentos' },
  { id: 'sobremesas', label: 'Sobremesas' },
]

const BURGER_EXTRAS: ProductExtra[] = [
  { id: 'bacon', label: 'Adicionar bacon', price: 5 },
  { id: 'carne', label: 'Adicionar carne', price: 8 },
  { id: 'queijo', label: 'Adicionar queijo', price: 3 },
]

const BURGER_REMOVABLES: ProductRemovable[] = [
  { id: 'cebola', label: 'Sem cebola' },
  { id: 'picles', label: 'Sem picles' },
  { id: 'molho', label: 'Sem molho' },
]

export const PRODUCTS: Product[] = [
  {
    id: 'black-classic',
    name: 'BLACK CLASSIC',
    description: 'Pão brioche, burger 160g, cheddar, cebola caramelizada, picles e molho da casa.',
    price: 27.9,
    category: 'hamburgueres',
    image: burgerClassic,
    badge: 'Mais pedido',
    extras: BURGER_EXTRAS,
    removables: BURGER_REMOVABLES,
  },
  {
    id: 'black-bacon',
    name: 'BLACK BACON',
    description: 'Burger 160g, cheddar, bacon artesanal, cebola crispy e barbecue.',
    price: 32.9,
    category: 'hamburgueres',
    image: burgerBacon,
    extras: BURGER_EXTRAS,
    removables: BURGER_REMOVABLES,
  },
  {
    id: 'double-fire',
    name: 'DOUBLE FIRE',
    description: 'Dois burgers 120g, cheddar duplo, bacon crocante e molho defumado.',
    price: 34.9,
    category: 'hamburgueres',
    imagePlaceholder: true,
    extras: BURGER_EXTRAS,
    removables: BURGER_REMOVABLES,
  },
  {
    id: 'black-smash',
    name: 'BLACK SMASH',
    description: 'Dois smash burgers, queijo americano, cebola prensada e molho da casa.',
    price: 31.9,
    category: 'hamburgueres',
    imagePlaceholder: true,
    extras: BURGER_EXTRAS,
    removables: BURGER_REMOVABLES,
  },
  {
    id: 'hot-one',
    name: 'HOT ONE',
    description: 'Burger 160g, pepper jack, jalapeño, cebola roxa e molho hot honey.',
    price: 30.9,
    category: 'hamburgueres',
    imagePlaceholder: true,
    extras: BURGER_EXTRAS,
    removables: BURGER_REMOVABLES,
  },
  {
    id: 'truffle',
    name: 'TRUFFLE',
    description: 'Burger 160g, queijo emmental, cogumelos, cebola caramelizada e maionese trufada.',
    price: 38.9,
    category: 'hamburgueres',
    imagePlaceholder: true,
    extras: BURGER_EXTRAS,
    removables: BURGER_REMOVABLES,
  },
  {
    id: 'chicken-crunch',
    name: 'CHICKEN CRUNCH',
    description: 'Frango crocante, cheddar, alface, picles e spicy mayo.',
    price: 28.9,
    category: 'hamburgueres',
    imagePlaceholder: true,
    extras: BURGER_EXTRAS,
    removables: BURGER_REMOVABLES,
  },
  {
    id: 'veggie-fire',
    name: 'VEGGIE FIRE',
    description: 'Burger vegetal, queijo, cebola caramelizada, tomate e molho da casa.',
    price: 29.9,
    category: 'hamburgueres',
    imagePlaceholder: true,
    badge: 'Vegetariano',
    extras: BURGER_EXTRAS,
    removables: BURGER_REMOVABLES,
  },

  {
    id: 'fritas-casa',
    name: 'FRITAS DA CASA',
    description: 'Fritas crocantes temperadas com especiarias da casa.',
    price: 14.9,
    category: 'acompanhamentos',
    imagePlaceholder: true,
  },
  {
    id: 'fritas-cheddar-bacon',
    name: 'FRITAS CHEDDAR & BACON',
    description: 'Fritas cobertas com cheddar cremoso e bacon crocante.',
    price: 19.9,
    category: 'acompanhamentos',
    imagePlaceholder: true,
  },
  {
    id: 'onion-rings',
    name: 'ONION RINGS',
    description: 'Anéis de cebola empanados, crocantes por fora e macios por dentro.',
    price: 16.9,
    category: 'acompanhamentos',
    imagePlaceholder: true,
  },
  {
    id: 'nuggets',
    name: 'NUGGETS',
    description: 'Seis unidades de frango empanado, com molho à escolha.',
    price: 17.9,
    category: 'acompanhamentos',
    imagePlaceholder: true,
  },

  {
    id: 'coca-cola',
    name: 'COCA-COLA',
    description: 'Lata 350ml, gelada.',
    price: 7.0,
    category: 'bebidas',
    imagePlaceholder: true,
  },
  {
    id: 'guarana',
    name: 'GUARANÁ',
    description: 'Lata 350ml, gelada.',
    price: 7.0,
    category: 'bebidas',
    imagePlaceholder: true,
  },
  {
    id: 'suco-laranja',
    name: 'SUCO DE LARANJA',
    description: 'Natural, feito na hora. Copo 400ml.',
    price: 9.9,
    category: 'bebidas',
    imagePlaceholder: true,
  },
  {
    id: 'agua',
    name: 'ÁGUA',
    description: 'Água mineral 500ml.',
    price: 4.0,
    category: 'bebidas',
    imagePlaceholder: true,
  },

  {
    id: 'milkshake',
    name: 'MILKSHAKE',
    description: 'Cremoso, feito na hora. Pergunte o sabor do dia.',
    price: 16.9,
    category: 'sobremesas',
    imagePlaceholder: true,
  },
  {
    id: 'brownie',
    name: 'BROWNIE COM SORVETE',
    description: 'Brownie quente com bola de sorvete de creme.',
    price: 18.9,
    category: 'sobremesas',
    imagePlaceholder: true,
  },
  {
    id: 'petit-gateau',
    name: 'PETIT GATEAU',
    description: 'Bolo de chocolate com centro cremoso e sorvete.',
    price: 21.9,
    category: 'sobremesas',
    imagePlaceholder: true,
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}
