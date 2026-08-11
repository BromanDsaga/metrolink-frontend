import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="container-shell flex min-h-[60vh] items-center justify-center py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="surface w-full max-w-md p-10 text-center"
        >
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            className="mb-2 text-7xl font-black text-red-600"
          >
            404
          </motion.p>

          <h1 className="mb-3 text-2xl font-black text-gray-900">Page not found</h1>

          <p className="mb-8 text-zinc-500">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col gap-3">
            <Link to="/">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="block rounded-full bg-red-600 px-8 py-3 font-bold text-white transition hover:bg-red-700"
              >
                Go back home
              </motion.span>
            </Link>

            <Link to="/products">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="block rounded-full border border-red-200 px-8 py-3 font-bold text-red-600 transition hover:bg-red-50"
              >
                Browse products
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
