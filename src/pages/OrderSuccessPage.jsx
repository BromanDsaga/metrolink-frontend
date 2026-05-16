import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

export default function OrderSuccessPage() {
  return (
    <PageTransition>
      <div className="container-shell flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="surface max-w-md w-full p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-7xl mb-6"
          >
            🎉
          </motion.div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Order Placed!</h1>
          <p className="text-zinc-500 mb-8">
            Thank you for shopping with Metrolink. Your order has been received and will be delivered in 24–48 hours.
          </p>
          <Link to="/products">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition"
            >
              Continue Shopping
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  )
}