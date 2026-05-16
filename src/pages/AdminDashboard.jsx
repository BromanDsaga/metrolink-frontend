import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import api from '../api/client'

const money = (amount) => `₦${Number(amount).toLocaleString()}`

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/orders'),
      api.get('/products', { params: { size: 100 } })
    ]).then(([ordersRes, productsRes]) => {
      setOrders(ordersRes.data || [])
      setProducts(productsRes.data.content || [])
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const lowStockProducts = products.filter(p => p.stock <= 10)

  const stats = [
    { label: 'Total Revenue', value: money(totalRevenue), icon: '💰' },
    { label: 'Total Orders', value: orders.length, icon: '📦' },
    { label: 'Total Products', value: products.length, icon: '🛍️' },
    { label: 'Pending Orders', value: pendingOrders, icon: '⏳' },
  ]

  return (
    <PageTransition>
      <div className="container-shell space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Admin Dashboard</h1>
            <p className="text-zinc-500 mt-1 text-sm">Store overview</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/products"
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
            >
              Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 hover:border-red-200 hover:text-red-600 transition"
            >
              View Orders
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="surface p-5 rounded-2xl border border-zinc-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-zinc-500">{label}</p>
                <span className="text-2xl">{icon}</span>
              </div>
              <p className="text-2xl font-black">
                {loading ? '...' : value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Recent Orders */}
          <section className="surface p-5 rounded-2xl border border-zinc-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-red-600 hover:underline">
                View all
              </Link>
            </div>
            {loading ? (
              <p className="text-zinc-400 text-sm">Loading...</p>
            ) : orders.length === 0 ? (
              <p className="text-zinc-400 text-sm">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div
                    key={order.id}
                    className="grid grid-cols-3 gap-2 rounded-2xl bg-zinc-50 p-4 text-sm"
                  >
                    <span className="font-semibold text-zinc-700 truncate">
                      {order.id.slice(0, 8)}...
                    </span>
                    <span className="font-bold">{money(order.total)}</span>
                    <span className={`font-semibold ${
                      order.status === 'DELIVERED' ? 'text-green-600' :
                      order.status === 'PENDING' ? 'text-orange-500' :
                      'text-red-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Low Stock */}
          <section className="surface p-5 rounded-2xl border border-zinc-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Low Stock</h2>
              <Link to="/admin/products" className="text-sm text-red-600 hover:underline">
                Manage
              </Link>
            </div>
            {loading ? (
              <p className="text-zinc-400 text-sm">Loading...</p>
            ) : lowStockProducts.length === 0 ? (
              <p className="text-zinc-400 text-sm">All products are well stocked ✅</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 text-sm"
                  >
                    <span className="font-medium truncate mr-2">{product.name}</span>
                    <span className="font-bold text-red-600 shrink-0">
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </PageTransition>
  )
}