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
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)

  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Fetch categories once on mount, resolving the initial ?category= URL
  // param in the SAME update as categoriesLoaded so the very first products
  // fetch below already has the right categoryId (no unfiltered flash).
  useEffect(() => {

    const categoryFromUrl = searchParams.get('category')

    api
      .get('/categories')
      .then((res) => {

        const matchedCategory = categoryFromUrl
          ? res.data.find(
              (cat) => cat.name.toLowerCase() === categoryFromUrl.toLowerCase()
            )
          : null

        setCategories(res.data)
        setActiveCategory(matchedCategory ? matchedCategory.id : null)

      })
      .catch(() => {})
      .finally(() => {
        setCategoriesLoaded(true)
      })

    // Only runs once on mount — later ?category= changes are handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-resolve the category if the URL's ?category= param changes later
  // (e.g. clicking a different category link without the page remounting)
  useEffect(() => {

    if (!categoriesLoaded) {
      return
    }

    const categoryFromUrl = searchParams.get('category')

    if (!categoryFromUrl) {
      setActiveCategory(null)
      return
    }

    const matchedCategory = categories.find(
      (cat) => cat.name.toLowerCase() === categoryFromUrl.toLowerCase()
    )

    setActiveCategory(matchedCategory ? matchedCategory.id : null)

  }, [searchParams, categories, categoriesLoaded])

  // Fetch products whenever the resolved category, query, or page changes
  useEffect(() => {

    // If the URL points at a category, wait until it's resolved to a
    // categoryId before fetching, so we never fetch the unfiltered list first.
    const categoryFromUrl = searchParams.get('category')

    if (categoryFromUrl && !categoriesLoaded) {
      return
    }

    let ignore = false

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

        if (ignore) {
          return
        }

        setProducts(res.data.content || [])
        setTotalPages(res.data.totalPages || 0)
        setTotalElements(res.data.totalElements || 0)

      })
      .catch(() => {
        if (!ignore) {
          setProducts([])
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }

  }, [query, activeCategory, page, categoriesLoaded, searchParams])

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