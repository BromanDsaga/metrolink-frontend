import { useEffect, useState } from 'react'
import PageTransition from '../components/PageTransition'
import api from '../api/client'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: ''
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchProducts = () => {
    api.get('/products', { params: { size: 100 } })
      .then(res => setProducts(res.data.content || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
    api.get('/categories').then(res => setCategories(res.data || []))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id || ''
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      setError('Name, price and stock are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        imageUrl: form.imageUrl,
        category: form.categoryId ? { id: parseInt(form.categoryId) } : null
      }
      if (editing) {
        await api.put(`/products/${editing.id}`, payload)
      } else {
        await api.post('/products', payload)
      }
      setShowModal(false)
      fetchProducts()
    } catch {
      setError('Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      fetchProducts()
    } catch {
      alert('Failed to delete product.')
    }
  }

  return (
    <PageTransition>
      <div className="container-shell space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Manage Products</h1>
            <p className="text-zinc-500 mt-1 text-sm">{products.length} products total</p>
          </div>
          <button
            onClick={openCreate}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            + Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="surface rounded-2xl border border-zinc-100 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-zinc-400">Loading...</p>
          ) : products.length === 0 ? (
            <p className="p-8 text-center text-zinc-400">No products yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                  <tr>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Product</th>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Category</th>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Price</th>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Stock</th>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-zinc-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl || 'https://via.placeholder.com/40'}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover bg-zinc-100"
                          />
                          <span className="font-semibold text-zinc-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-500">
                        {product.category?.name || '—'}
                      </td>
                      <td className="px-5 py-4 font-bold">
                        ₦{Number(product.price).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-semibold ${product.stock <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-semibold hover:border-red-200 hover:text-red-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-black mb-4">
              {editing ? 'Edit Product' : 'Add Product'}
            </h2>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {[
                { label: 'Product Name', key: 'name', type: 'text' },
                { label: 'Price (₦)', key: 'price', type: 'number' },
                { label: 'Stock', key: 'stock', type: 'number' },
                { label: 'Image URL', key: 'imageUrl', type: 'text' },
              ].map(({ label, key, type }) => (
                <label key={key} className="block">
                  <span className="mb-1 block text-sm font-medium">{label}</span>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none focus:border-red-300"
                  />
                </label>
              ))}

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Category</span>
                <select
                  value={form.categoryId}
                  onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none focus:border-red-300"
                >
                  <option value="">No category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Description</span>
                <textarea
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-red-300"
                />
              </label>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-full border border-zinc-200 py-3 text-sm font-semibold hover:bg-zinc-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-full bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  )
}