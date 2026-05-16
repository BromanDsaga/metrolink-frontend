import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { money } from '../data'
import { useCartStore } from '../store/cartStore'
import ProductArt from './ProductArt'

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 1500)
  }

  return (
    <motion.article whileHover={{ y: -4 }} className="surface group relative p-3">
      <div className="relative">
        <ProductArt product={product} />

        <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-zinc-500 shadow-sm">
          <Heart size={16} />
        </button>

        <AnimatePresence>
          {added && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow-sm"
            >
              Added
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link to={`/products/${product.slug || product.id}`} className="mt-4 block">
        <h3 className="font-semibold text-zinc-950">{product.name}</h3>
        <p className="mt-1 text-xs text-zinc-500">
          {product.size || product.description || 'Available now'}
        </p>
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold">{money(product.price)}</span>

        <button
          onClick={handleAddToCart}
          className={`grid h-9 w-9 place-items-center rounded-full text-white transition hover:scale-105 ${
            added ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
        </button>
      </div>
    </motion.article>
  )
}