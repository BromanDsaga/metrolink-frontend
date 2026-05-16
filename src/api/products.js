import api from './client'

export async function fetchProducts(params = {}) {
  try {
    const { data } = await api.get('/products', { params })
    // Backend returns paginated response
    if (Array.isArray(data?.content)) return data.content
    if (Array.isArray(data)) return data
    return []
  } catch {
    return []
  }
}

export async function fetchProduct(id) {
  try {
    const { data } = await api.get(`/products/${id}`)
    return data
  } catch {
    return null
  }
}

export async function fetchProductBySlug(slug) {
  try {
    const { data } = await api.get('/products', { params: { query: slug } })
    if (Array.isArray(data?.content) && data.content.length > 0) {
      return data.content[0]
    }
    return null
  } catch {
    return null
  }
}