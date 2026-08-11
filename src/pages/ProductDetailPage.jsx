import { Minus, Plus, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'
import { money } from '../data'
import { useCartStore } from '../store/cartStore'
import api from '../api/client'

export default function ProductDetailPage() {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recommended, setRecommended] = useState([])
  const [quantity, setQuantity] = useState(1)

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    let ignore = false

    setLoading(true)
    setQuantity(1)

    api
      .get(`/products/${id}`)
      .then((res) => {
        if (ignore) return
        setProduct(res.data)
      })
      .catch(() => {
        if (!ignore) setProduct(null)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id])

  useEffect(() => {
    const categoryId = product?.category?.id

    if (!categoryId) {
      setRecommended([])
      return
    }

    let ignore = false

    api
      .get('/products', { params: { categoryId, size: 5 } })
      .then((res) => {
        if (ignore) return
        const items = (res.data.content || []).filter((item) => item.id !== product.id)
        setRecommended(items.slice(0, 4))
      })
      .catch(() => {
        if (!ignore) setRecommended([])
      })

    return () => {
      ignore = true
    }
  }, [product?.id, product?.category?.id])

  if (loading) {
    return (
      <PageTransition>
        <div className="container-shell">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="surface h-80 animate-pulse" />
            <div className="surface animate-pulse p-6">
              <div className="h-4 w-1/3 rounded bg-zinc-100" />
              <div className="mt-4 h-8 w-2/3 rounded bg-zinc-100" />
              <div className="mt-6 h-6 w-1/4 rounded bg-zinc-100" />
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="container-shell">
          <div className="surface p-10 text-center">
            <p className="text-lg font-semibold">Product not found</p>
            <p className="mt-2 text-sm text-zinc-500">
              This product may have been removed or the link is invalid.
            </p>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="container-shell space-y-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <ProductArt product={product} large />
          <div className="surface p-6">
            <p className="text-sm text-zinc-500">&larr; Back to products</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight">{product.name}</h1>
            <p className="mt-2 text-sm text-zinc-500">{product.category?.name}</p>
            <div className="mt-5 text-3xl font-black text-red-600">{money(product.price)}</div>
            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">
              {product.description ||
                'Freshly stocked and ready for quick delivery. A dependable everyday choice with simple pricing and consistent quality.'}
            </p>
            <p
              className={`mt-4 text-sm font-semibold ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-zinc-200">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center"><Minus size={16} /></button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="grid h-11 w-11 place-items-center"><Plus size={16} /></button>
              </div>
              <button
                onClick={() => addItem(product, quantity)}
                disabled={product.stock <= 0}
                className="h-11 rounded-full bg-red-600 px-8 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
            <div className="mt-8 grid gap-3 border-t border-zinc-100 pt-5 sm:grid-cols-3">
              {[
                [Truck, 'Fast Delivery', '24-48 hours'],
                [ShieldCheck, 'Quality Guarantee', '100% original'],
                [RotateCcw, 'Easy Returns', '7 day return'],
              ].map(([Icon, title, copy]) => (
                <div key={title} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-600"><Icon size={16} /></span>
                  <span>
                    <span className="block text-sm font-semibold">{title}</span>
                    <span className="block text-xs text-zinc-500">{copy}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {recommended.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="section-title">You may also like</h2>

              {product.category?.name && (
                <Link
                  to={`/products?category=${encodeURIComponent(product.category.name)}`}
                  className="shrink-0 text-sm font-semibold text-red-600 hover:underline"
                >
                  View all in {product.category.name} &rarr;
                </Link>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
              {recommended.map((item) => (
                <div key={item.id} className="w-[68%] shrink-0 sm:w-auto">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </PageTransition>
  )
}
