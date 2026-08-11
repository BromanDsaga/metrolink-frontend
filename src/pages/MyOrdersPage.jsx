import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import api from '../api/client'

const money = (amount) => `₦${Number(amount).toLocaleString()}`

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const STATUS_STYLES = {
  PENDING: 'bg-orange-50 text-orange-600',
  PROCESSING: 'bg-blue-50 text-blue-600',
  SHIPPED: 'bg-purple-50 text-purple-600',
  DELIVERED: 'bg-green-50 text-green-600',
  CANCELLED: 'bg-red-50 text-red-600',
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    setLoading(true)

    api
      .get('/orders/my-orders')
      .then((res) => {
        if (ignore) return
        setOrders(res.data || [])
      })
      .catch(() => {
        if (!ignore) setError('Failed to load your orders. Please try again.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <PageTransition>
      <div className="container-shell">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-tight">My Orders</h1>
          <p className="muted mt-1">Track and review your past orders.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="surface animate-pulse p-5">
                <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div>
                    <div className="h-3 w-24 rounded bg-zinc-100" />
                    <div className="mt-2 h-3 w-16 rounded bg-zinc-100" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-20 rounded-full bg-zinc-100" />
                    <div className="h-4 w-14 rounded bg-zinc-100" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded bg-zinc-100" />
                  <div className="h-3 w-2/3 rounded bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="surface p-8 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="surface grid min-h-[300px] place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600">
                <Package size={28} />
              </div>

              <h2 className="mt-4 text-xl font-bold">No orders yet</h2>

              <p className="mt-2 text-sm text-zinc-500">
                When you place an order, it'll show up here.
              </p>

              <Link
                to="/products"
                className="mt-6 inline-block rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="surface p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div>
                    <p className="text-xs font-medium text-zinc-400">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        STATUS_STYLES[order.status] || 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {order.status}
                    </span>

                    <span className="font-bold text-red-600">
                      {money(order.total)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="text-zinc-700">
                        {item.product?.name || 'Product'}{' '}
                        <span className="text-zinc-400">× {item.quantity}</span>
                      </span>

                      <span className="text-zinc-500">{money(item.unitPrice)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
