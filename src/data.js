export const categories = [
  'Biscuits & Snacks',
  'Sweets & Chocolates',
  'Noodles & Pasta',
  'Beverages',
  'Seasoning & Spices',
  'Soap & Detergents',
  'Personal Care',
  'Household Essentials',
]

export const products = [
  { id: 1, slug: 'peak-milk-powder', name: 'Peak Milk Powder', category: 'Beverages', size: '400g', price: 2450, palette: 'from-sky-100 to-blue-200', accent: 'bg-blue-600' },
  { id: 2, slug: 'indomie-chicken-noodles', name: 'Indomie Instant Noodles', category: 'Noodles & Pasta', size: 'Chicken 70g', price: 120, palette: 'from-amber-100 to-orange-200', accent: 'bg-orange-500' },
  { id: 3, slug: 'oreo-original', name: 'Oreo Original', category: 'Biscuits & Snacks', size: '133g', price: 850, palette: 'from-slate-100 to-blue-100', accent: 'bg-slate-800' },
  { id: 4, slug: 'coca-cola-original', name: 'Coca Cola Original', category: 'Beverages', size: '50cl', price: 700, palette: 'from-red-100 to-rose-200', accent: 'bg-red-700' },
  { id: 5, slug: 'sunlight-laundry-soap', name: 'Sunlight Laundry Soap', category: 'Soap & Detergents', size: '190g', price: 350, palette: 'from-yellow-100 to-amber-200', accent: 'bg-yellow-500' },
  { id: 6, slug: 'dano-cool-cow-milk', name: 'Dano Cool Cow Milk', category: 'Beverages', size: '400g', price: 2200, palette: 'from-red-100 to-pink-100', accent: 'bg-red-500' },
  { id: 7, slug: 'golden-morn-cereal', name: 'Golden Morn Cereal', category: 'Cooking Essentials', size: '500g', price: 1450, palette: 'from-orange-100 to-yellow-200', accent: 'bg-orange-500' },
  { id: 8, slug: 'maggi-star-cubes', name: 'Maggi Star Cubes', category: 'Seasoning & Spices', size: '24 Cubes', price: 300, palette: 'from-yellow-100 to-orange-100', accent: 'bg-yellow-500' },
  { id: 9, slug: 'eva-water', name: 'Eva Water', category: 'Beverages', size: '75cl', price: 250, palette: 'from-cyan-100 to-sky-100', accent: 'bg-sky-500' },
]

export const money = (value) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value)
