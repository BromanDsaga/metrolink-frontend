import { useEffect, useState } from 'react'
import PageTransition from '../components/PageTransition'
import api from '../api/client'

const money = (amount) => `₦${Number(amount).toLocaleString()}`

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const statusColor = (status) => {
  switch (status) {
    case 'DELIVERED': return 'text-green-600 bg-green-50'
    case 'PENDING': return 'text-orange-500 bg-orange-50'
    case 'PROCESSING': return 'text-blue-600 bg-blue-50'
    case 'SHIPPED': return 'text-purple-600 bg-purple-50'
    case 'CANCELLED': return 'text-red-600 bg-red-50'
    default: return 'text-zinc-600 bg-zinc-50'
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data || []))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, null, { params: { status } })
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status } : o)
      )
    } catch {
      alert('Failed to update status.')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <PageTransition>
      <div className="container-shell space-y-6">
        <div>
          <h1 className="text-3xl font-black">Orders</h1>
          <p className="text-zinc-500 mt-1 text-sm">{orders.length} orders total</p>
        </div>

        <div className="surface rounded-2xl border border-zinc-100 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-zinc-400">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="p-8 text-center text-zinc-400">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                  <tr>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Order ID</th>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Customer</th>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Total</th>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Date</th>
                    <th className="text-left px-5 py-4 font-semibold text-zinc-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-zinc-50 transition">
                      <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-5 py-4 text-zinc-700">
                        {order.user?.email || '—'}
                      </td>
                      <td className="px-5 py-4 font-bold">
                        {money(order.total)}
                      </td>
                      <td className="px-5 py-4 text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold border-0 outline-none cursor-pointer ${statusColor(order.status)}`}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}