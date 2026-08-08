import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Heart, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { money } from '../data'
import { useCartStore } from '../store/cartStore'
import ProductArt from './ProductArt'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)

  const [added, setAdded] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [favoriteMessage, setFavoriteMessage] = useState('')

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorite(savedFavorites.some((item) => item.id === product.id))
  }, [product.id])

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 1500)
  }

  const handleFavorite = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')

    const alreadyFavorite = savedFavorites.some((item) => item.id === product.id)

    let updatedFavorites

    if (alreadyFavorite) {
      updatedFavorites = savedFavorites.filter((item) => item.id !== product.id)
      setFavorite(false)
      setFavoriteMessage('Removed from favorites')
    } else {
      updatedFavorites = [...savedFavorites, product]
      setFavorite(true)
      setFavoriteMessage('Added to favorites')
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))

    setTimeout(() => {
      setFavoriteMessage('')
    }, 1500)
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/products/${product.id}`)}
      className="surface group relative cursor-pointer p-3"
    >
      <div className="relative">
        <ProductArt product={product} />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleFavorite()
          }}
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full shadow-sm transition ${
            favorite
              ? 'bg-red-600 text-white'
              : 'bg-white/90 text-zinc-500 hover:text-red-600'
          }`}
        >
          <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
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

          {favoriteMessage && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-3 left-3 rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white shadow-sm"
            >
              {favoriteMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 block">
        <h3 className="font-semibold text-zinc-950">{product.name}</h3>
        <p className="mt-1 text-xs text-zinc-500">
          {product.size || product.description || 'Available now'}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold">{money(product.price)}</span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleAddToCart()
          }}
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