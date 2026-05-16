import { useEffect, useState } from 'react'
import { fetchProducts } from '../api/products'

export function useProducts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetchProducts().then((result) => {
      if (mounted) {
        setItems(result)
        setLoading(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  return { products: items, loading }
}
