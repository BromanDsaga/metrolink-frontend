import { motion } from 'framer-motion'
import {
  BadgePercent,
  Headphones,
  ShieldCheck,
  Truck,
} from 'lucide-react'

import { categories } from '../data'
import { useEffect, useState } from 'react'
import api from '../api/client'

import PageTransition from '../components/PageTransition'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'

const perks = [
  [Truck, 'Fast Delivery', 'In 24–48 hours'],
  [BadgePercent, 'Best Prices', 'Unbeatable deals'],
  [ShieldCheck, 'Quality Products', '100% guaranteed'],
  [Headphones, 'Secure Shopping', 'Safe checkout'],
]

export default function HomePage() {

  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await api.get('/products')

        setFeaturedProducts(response.data.content || [])

      } catch (error) {

        console.error('Failed to fetch products', error)

      }

    }

    fetchProducts()

  }, [])

  return (
    <PageTransition>

      <div className="container-shell space-y-8">

        <section className="grid gap-5 lg:grid-cols-[220px_1fr]">

          <aside className="surface hidden p-4 lg:block">

            <div className="mb-3 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white">
              All Categories
            </div>

            <div className="space-y-3">

              {categories.map((category) => (

                <Link
                  key={category}
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="block text-sm text-zinc-700 transition hover:text-red-600"
                >
                  {category}
                </Link>

              ))}

            </div>

          </aside>

          <div className="space-y-5">

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-700 via-red-700 to-red-900 p-6 text-white shadow-[0_20px_45px_rgba(185,28,28,0.28)] md:p-10">

              <div className="relative z-10 max-w-lg">

                <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                  Everyday essentials,
                  delivered to you
                </h1>

                <p className="mt-4 max-w-md text-sm text-red-50 md:text-base">
                  Quality groceries, household staples, and convenience-store favorites at prices that feel easy every day.
                </p>

                <Link
                  to="/products"
                  className="mt-6 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-bold text-red-700 transition hover:scale-[1.02] hover:bg-zinc-100"
                >
                  Shop Now →
                </Link>

              </div>

              <div className="absolute -right-8 bottom-0 hidden h-[88%] w-[42%] items-end justify-center md:flex">

                <div className="relative h-52 w-72 rounded-t-[2rem] bg-red-950/20">

                  <div className="absolute bottom-8 left-4 right-4 h-28 rounded-2xl bg-red-500/90" />

                  <div className="absolute bottom-24 left-12 h-28 w-10 rounded-full bg-yellow-400" />

                  <div className="absolute bottom-24 left-28 h-32 w-10 rounded-full bg-orange-400" />

                  <div className="absolute bottom-24 right-16 h-24 w-10 rounded-full bg-cyan-200" />

                </div>

              </div>

            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

              {perks.map(([Icon, title, text]) => (

                <div
                  key={title}
                  className="surface flex items-center gap-3 p-4"
                >

                  <span className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600">
                    <Icon size={18} />
                  </span>

                  <div>

                    <div className="text-sm font-semibold">
                      {title}
                    </div>

                    <div className="text-xs text-zinc-500">
                      {text}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>

        <section>

          <SectionHeader title="Shop by Category" />

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">

            {categories.slice(0, 6).map((category, index) => (

              <motion.div
                whileHover={{ y: -4 }}
                key={category}
              >

                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="surface block cursor-pointer p-4 text-center transition hover:border hover:border-red-200"
                >

                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-2xl">
                    {['🍪', '🍫', '🍜', '🥤', '🧼', '🧂'][index]}
                  </div>

                  <div className="mt-4 text-sm font-semibold">
                    {category}
                  </div>

                  <div className="mt-1 text-xs text-zinc-500">
                    {120 - index * 10}+ items
                  </div>

                </Link>

              </motion.div>

            ))}

          </div>

        </section>

        <section>

          <SectionHeader title="Featured Products" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {featuredProducts.slice(0, 4).map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </div>

        </section>

        <section className="grid gap-4 lg:grid-cols-2">

          <div className="rounded-2xl bg-gradient-to-br from-red-700 to-red-900 p-6 text-white">

            <h3 className="text-xl font-bold">
              100% original products
            </h3>

            <p className="mt-2 text-sm text-red-100">
              Quality guaranteed across pantry staples, cleaning supplies, and household care.
            </p>

          </div>

          <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-6 text-white">

            <h3 className="text-xl font-bold">
              Fast & reliable delivery
            </h3>

            <p className="mt-2 text-sm text-zinc-200">
              Built for quick weekly restocks, not bulky warehouse shopping.
            </p>

          </div>

        </section>

      </div>

    </PageTransition>
  )
}