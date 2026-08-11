import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import { useCartStore } from '../store/cartStore'
import api from '../api/client'

const money = (amount) => `₦${Number(amount).toLocaleString()}`

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore()
  const serviceFee = items.length ? 500 : 0
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('ON_PICKUP')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'ONLINE') {
      setError('Online payment is coming soon. Please choose Pay on Pickup.')
      return
    }

    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city || !form.state) {
      setError('Please fill in all required fields.')
      return
    }

    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/auth', { state: { from: '/checkout' } })
      return
    }

    setLoading(true)
    setError('')

    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }))

      await api.post('/orders', { items: orderItems, paymentMethod })

      const orderDetails = {
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: subtotal() + serviceFee,
        paymentMethod,
      }

      clearCart()
      navigate('/order-success', { state: orderDetails })
    } catch (err) {
      setError('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { label: 'Full name', key: 'fullName', span: false },
    { label: 'Email', key: 'email', span: false },
    { label: 'Phone', key: 'phone', span: false },
    { label: 'Address', key: 'address', span: true },
    { label: 'City', key: 'city', span: false },
    { label: 'State', key: 'state', span: false },
    { label: 'Postal code', key: 'postalCode', span: false },
  ]

  return (
    <PageTransition>
      <div className="container-shell grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="surface p-5">
          <h1 className="text-2xl font-black">Checkout</h1>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {fields.map(({ label, key, span }) => (
              <label key={key} className={span ? 'sm:col-span-2' : ''}>
                <span className="mb-2 block text-sm font-medium">{label}</span>
                <input
                  value={form[key]}
                  onChange={handleChange(key)}
                  className="h-12 w-full rounded-2xl border border-zinc-200 px-4 outline-none focus:border-red-300"
                />
              </label>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="font-bold">Pickup Information</h2>

            <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              Come pick up your order at our store. No delivery fee.
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-bold">Payment Method</h2>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('ON_PICKUP')

                  if (error === 'Online payment is coming soon. Please choose Pay on Pickup.') {
                    setError('')
                  }
                }}
                className={`rounded-2xl border p-4 text-left font-semibold transition ${
                  paymentMethod === 'ON_PICKUP'
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : 'border-zinc-200 hover:border-red-200'
                }`}
              >
                💵 Pay on Pickup
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('ONLINE')}
                className={`rounded-2xl border p-4 text-left font-semibold transition ${
                  paymentMethod === 'ONLINE'
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : 'border-zinc-200 hover:border-red-200'
                }`}
              >
                💳 Pay Online
                <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                  Coming soon
                </span>
              </button>
            </div>

            {paymentMethod === 'ONLINE' && (
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                Online payment is coming soon. Please choose Pay on Pickup.
              </div>
            )}
          </div>
        </section>

        <aside className="surface h-fit p-5">
          <h2 className="text-xl font-bold">Order Summary</h2>

          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>{money(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 border-t border-zinc-100 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(subtotal())}</span>
            </div>

            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>{money(serviceFee)}</span>
            </div>

            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-red-600">{money(subtotal() + serviceFee)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-6 w-full rounded-full bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Placing order...' : 'Place Order'}
          </button>
        </aside>
      </div>
    </PageTransition>
  )
}