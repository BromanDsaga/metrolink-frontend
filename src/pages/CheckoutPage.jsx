import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import { useCartStore } from '../store/cartStore'
import api from '../api/client'

const money = (amount) => `₦${Number(amount).toLocaleString()}`

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore()
  const delivery = items.length ? 1500 : 0
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

  const [paymentMethod, setPaymentMethod] = useState('delivery')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card') {
      setError('Card payment is not available yet. Please choose Pay on Delivery.')
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

      await api.post('/orders', orderItems)

      const orderDetails = {
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: subtotal() + delivery,
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
            <h2 className="font-bold">Delivery Options</h2>

            <label className="mt-3 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4">
              <span>
                <span className="block font-semibold">Standard Delivery</span>
                <span className="text-sm text-zinc-500">24–48 hours</span>
              </span>

              <span className="font-semibold">{money(1500)}</span>
            </label>
          </div>

          <div className="mt-6">
            <h2 className="font-bold">Payment Method</h2>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('delivery')

                  if (error === 'Card payment is not available yet. Please choose Pay on Delivery.') {
                    setError('')
                  }
                }}
                className={`rounded-2xl border p-4 text-left font-semibold transition ${
                  paymentMethod === 'delivery'
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : 'border-zinc-200 hover:border-red-200'
                }`}
              >
                💵 Pay on Delivery
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`rounded-2xl border p-4 text-left font-semibold transition ${
                  paymentMethod === 'card'
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : 'border-zinc-200 hover:border-red-200'
                }`}
              >
                💳 Pay with Card
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                Card payment is not available yet. Please choose Pay on Delivery.
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
              <span>Delivery</span>
              <span>{money(delivery)}</span>
            </div>

            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-red-600">{money(subtotal() + delivery)}</span>
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