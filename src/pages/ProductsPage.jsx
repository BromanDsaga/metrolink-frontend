import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import api from '../api/client'

export default function ProductsPage() {

  const [searchParams] = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('query') || '')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)

  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Fetch categories
  useEffect(() => {

    api
      .get('/categories')
      .then((res) => {

        setCategories(res.data)

        // Read category from URL
        const categoryFromUrl = searchParams.get('category')

        if (categoryFromUrl) {

          const matchedCategory = res.data.find(
            (cat) =>
              cat.name.toLowerCase() === categoryFromUrl.toLowerCase()
          )

          if (matchedCategory) {
            setActiveCategory(matchedCategory.id)
          }

        }

      })
      .catch(() => {})

  }, [searchParams])

  // Fetch products
  useEffect(() => {

    setLoading(true)

    const params = {
      page,
      size: 12,
    }

    if (query) {
      params.query = query
    }

    if (activeCategory) {
      params.categoryId = activeCategory
    }

    api
      .get('/products', { params })
      .then((res) => {

        setProducts(res.data.content || [])
        setTotalPages(res.data.totalPages || 0)
        setTotalElements(res.data.totalElements || 0)

      })
      .catch(() => {
        setProducts([])
      })
      .finally(() => {
        setLoading(false)
      })

  }, [query, activeCategory, page])

  // Sync search query from URL
  useEffect(() => {

    const urlQuery = searchParams.get('query')

    if (urlQuery) {
      setQuery(urlQuery)
    }

  }, [searchParams])

  const handleSearch = (e) => {

    if (e.key === 'Enter') {
      setPage(0)
    }

  }

  return (
    <PageTransition>

      <div className="container-shell">

        {/* Header */}
        <div className="mb-6">

          <h1 className="text-3xl font-black tracking-tight">
            All Products
          </h1>

          <p className="muted mt-1">
            Home / Shop
          </p>

        </div>

        {/* Search */}
        <div className="surface mb-5 flex flex-col gap-3 p-3 md:flex-row">

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search products..."
            className="h-12 flex-1 rounded-full border border-zinc-200 px-5 outline-none focus:border-red-300"
          />

          <button
            onClick={() => {
              setPage(0)
            }}
            className="h-12 rounded-full bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Search
          </button>

        </div>

        {/* Category Pills */}
        <div className="mb-6 flex flex-wrap gap-2">

          <button
            onClick={() => {
              setActiveCategory(null)
              setPage(0)
            }}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeCategory === null
                ? 'bg-red-600 text-white'
                : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:bg-red-50'
            }`}
          >
            All
          </button>

          {categories.map((cat) => (

            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id)
                setPage(0)
              }}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:bg-red-50'
              }`}
            >
              {cat.name}
            </button>

          ))}

        </div>

        {/* Results Count */}
        <p className="mb-4 text-sm text-zinc-500">
          Showing {products.length} of {totalElements} products
        </p>

        {/* Products Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {loading ? (

            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))

          ) : products.length === 0 ? (

            <div className="col-span-4 py-20 text-center text-zinc-400">

              <p className="mb-4 text-4xl">
                🔍
              </p>

              <p className="font-semibold">
                No products found
              </p>

              <p className="mt-1 text-sm">
                Try a different search or category
              </p>

            </div>

          ) : (

            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))

          )}

        </div>

        {/* Pagination */}
        {totalPages > 1 && (

          <div className="mt-8 flex justify-center gap-2">

            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="grid h-10 min-w-10 place-items-center rounded-full border border-zinc-200 bg-white disabled:opacity-40"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (

              <button
                key={i}
                onClick={() => setPage(i)}
                className={`grid h-10 min-w-10 place-items-center rounded-full border ${
                  page === i
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-zinc-200 bg-white'
                }`}
              >
                {i + 1}
              </button>

            ))}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages - 1}
              className="grid h-10 min-w-10 place-items-center rounded-full border border-zinc-200 bg-white disabled:opacity-40"
            >
              ›
            </button>

          </div>

        )}

      </div>

    </PageTransition>
  )
}