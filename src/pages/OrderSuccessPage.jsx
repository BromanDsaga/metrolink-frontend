import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import PageTransition from '../components/PageTransition'

const money = (amount) => `₦${Number(amount).toLocaleString()}`

const WHATSAPP_NUMBER = '2348012345678'

const buildWhatsAppMessage = (order) => {
  const lines = [
    'Hello Metrolink! I just placed an order:',
    '',
    ...order.items.map(
      (item) => `- ${item.name} x${item.quantity} — ${money(item.price * item.quantity)}`
    ),
    '',
    `Total: ${money(order.total)}`,
    '',
    'Please confirm my order. Thank you!',
  ]

  return lines.join('\n')
}

export default function OrderSuccessPage() {
  const location = useLocation()
  const order = location.state

  const whatsappUrl = order
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(order))}`
    : null

  return (
    <PageTransition>
      <div className="container-shell flex min-h-[60vh] items-center justify-center py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="surface w-full max-w-md p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6 text-7xl"
          >
            🎉
          </motion.div>

          <h1 className="mb-3 text-3xl font-black text-gray-900">Order Placed!</h1>

          <p className="mb-8 text-zinc-500">
            Thank you for shopping with Metrolink. Your order has been received and will be delivered in 24–48 hours.
          </p>

          {order && (
            <div className="mb-8 rounded-2xl border border-zinc-100 bg-zinc-50 p-5 text-left">
              <p className="mb-3 text-sm font-semibold text-zinc-700">
                Order Summary
              </p>

              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between gap-4 text-sm text-zinc-600"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{money(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between border-t border-zinc-200 pt-3 text-sm font-bold">
                <span>Total</span>
                <span className="text-red-600">{money(order.total)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link to="/products">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="block rounded-full bg-red-600 px-8 py-3 font-bold text-white transition hover:bg-red-700"
              >
                Continue Shopping
              </motion.span>
            </Link>

            {whatsappUrl && (
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 rounded-full border border-red-200 px-8 py-3 font-bold text-red-600 transition hover:bg-red-50"
              >
                <MessageCircle size={18} />
                Share order on WhatsApp
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
