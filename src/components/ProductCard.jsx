import { motion } from 'framer-motion'
import { Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { money } from '../data'
import { useCartStore } from '../store/cartStore'
import ProductArt from './ProductArt'

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <motion.article whileHover={{ y: -4 }} className="surface group p-3">
      <div className="relative">
        <ProductArt product={product} />
        <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-zinc-500 shadow-sm">
          <Heart size={16} />
        </button>
      </div>
      <Link to={`/products/${product.slug}`} className="mt-4 block">
        <h3 className="font-semibold text-zinc-950">{product.name}</h3>
        <p className="mt-1 text-xs text-zinc-500">{product.size}</p>
      </Link>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold">{money(product.price)}</span>
        <button onClick={() => addItem(product)} className="grid h-9 w-9 place-items-center rounded-full bg-red-600 text-white transition hover:scale-105 hover:bg-red-700">
          <Plus size={16} />
        </button>
      </div>
    </motion.article>
  )
}
