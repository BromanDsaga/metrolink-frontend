import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import ProductCard from '../components/ProductCard'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(savedFavorites)
  }, [])

  return (
    <PageTransition>
      <div className="container-shell">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-tight">
            My Favorites
          </h1>
          <p className="muted mt-1">
            Products you saved for later.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="surface grid min-h-[300px] place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600">
                <Heart size={28} />
              </div>

              <h2 className="mt-4 text-xl font-bold">
                No favorites yet
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Tap the heart icon on a product to save it here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}