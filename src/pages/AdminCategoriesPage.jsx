import { useEffect, useState } from 'react'
import PageTransition from '../components/PageTransition'
import api from '../api/client'

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchCategories = () => {
    api.get('/categories').then(res => setCategories(res.data || []))
  }

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/products', { params: { size: 100 } })
    ]).then(([categoriesRes, productsRes]) => {
      setCategories(categoriesRes.data || [])
      setProducts(productsRes.data.content || [])
    }).finally(() => setLoading(false))
  }, [])

  const productCount = (categoryId) =>
    products.filter(p => p.category?.id === categoryId).length

  const openCreate = () => {
    setName('')
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Category name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await api.post('/categories', { name: name.trim(), slug: slugify(name) })
      setShowModal(false)
      fetchCategories()
    } catch {
      setError('Failed to save category.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category) => {
    const count = productCount(category.id)
    const warning = count > 0
      ? `Delete "${category.name}"? This category has ${count} product${count === 1 ? '' : 's'}.`
      : `Delete "${category.name}"?`

    if (!window.confirm(warning)) return

    try {
      await api.delete(`/categories/${category.id}`)
      fetchCategories()
    } catch {
      alert('Failed to delete category.')
    }
  }

  return (
    <PageTransition>
      <div className="container-shell space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Manage Categories</h1>
            <p className="text-zinc-500 mt-1 text-sm">{categories.length} categories total</p>
          </div>
          <button
            onClick={openCreate}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            + Add Category
          </button>
        </div>

        {/* Categories Table */}
        <div className="surface rounded-2xl border border-zinc-100 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-zinc-400">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="p-8 text-center text-zinc-400">No categories yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                  <tr>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Name</th>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Slug</th>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Products</th>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {categories.map(category => (
                    <tr key={category.id} className="hover:bg-zinc-50 transition">
                      <td className="px-5 py-4 font-semibold text-zinc-800">
                        {category.name}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                        {category.slug}
                      </td>
                      <td className="px-5 py-4 text-zinc-600">
                        {productCount(category.id)}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(category)}
                          className="rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
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
            <h2 className="text-xl font-black mb-4">Add Category</h2>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Category Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Frozen Foods"
                  className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none focus:border-red-300"
                />
              </label>

              <p className="text-xs text-zinc-400">
                Slug: <span className="font-mono">{name.trim() ? slugify(name) : '—'}</span>
              </p>
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
                {saving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  )
}
