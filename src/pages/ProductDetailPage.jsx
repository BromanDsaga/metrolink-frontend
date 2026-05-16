import { Minus, Plus, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'
import { money, products } from '../data'
import { useCartStore } from '../store/cartStore'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug) ?? products[1]
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const recommended = useMemo(() => products.filter((item) => item.id !== product.id).slice(0, 4), [product.id])

  return (
    <PageTransition>
      <div className="container-shell space-y-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <ProductArt product={product} large />
          <div className="surface p-6">
            <p className="text-sm text-zinc-500">&larr; Back to products</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight">{product.name}</h1>
            <p className="mt-2 text-sm text-zinc-500">{product.category} / {product.size}</p>
            <div className="mt-5 text-3xl font-black text-red-600">{money(product.price)}</div>
            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">Freshly stocked and ready for quick delivery. A dependable everyday choice with simple pricing and consistent quality.</p>
            <p className="mt-4 text-sm font-semibold text-green-600">In Stock</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-zinc-200">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center"><Minus size={16} /></button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="grid h-11 w-11 place-items-center"><Plus size={16} /></button>
              </div>
              <button onClick={() => addItem(product, quantity)} className="h-11 rounded-full bg-red-600 px-8 font-semibold text-white hover:bg-red-700">Add to Cart</button>
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

        <section>
          <h2 className="section-title mb-5">You may also like</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
