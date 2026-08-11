import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, MessageCircle } from 'lucide-react'
import jsPDF from 'jspdf'
import PageTransition from '../components/PageTransition'
import { useAuthStore } from '../store/authStore'

const money = (amount) => `₦${Number(amount).toLocaleString()}`

// jsPDF's built-in fonts don't include the Naira glyph, so the PDF uses
// "NGN" instead of "₦" (the on-screen UI keeps "₦" via money() above).
const pdfMoney = (amount) => `NGN ${Number(amount).toLocaleString()}`

const WHATSAPP_NUMBER = '2348012345678'

const paymentMethodLabel = (method) =>
  method === 'ONLINE' ? 'Paid Online' : 'Pay on Pickup'

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

const generateInvoiceNumber = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
  }

  return Date.now().toString(36).slice(0, 8).toUpperCase()
}

const buildInvoicePdf = (order, email) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginX = 14
  let y = 22

  // Header — Metrolink "logo"
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(220, 38, 38)
  doc.text('Metrolink', marginX, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(140, 140, 140)
  doc.text('Everyday Essentials', marginX, y + 6)

  doc.setTextColor(0, 0, 0)
  y += 16
  doc.setDrawColor(230, 230, 230)
  doc.line(marginX, y, pageWidth - marginX, y)
  y += 10

  // Invoice meta
  const invoiceNumber = generateInvoiceNumber()
  const orderDate = new Date().toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Invoice', marginX, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Invoice #: ${invoiceNumber}`, marginX, y)
  doc.text(`Date: ${orderDate}`, pageWidth - marginX, y, { align: 'right' })
  y += 6
  doc.text(`Customer: ${email || 'Guest'}`, marginX, y)
  y += 6
  doc.text(`Payment: ${paymentMethodLabel(order.paymentMethod)}`, marginX, y)
  y += 12

  // Table
  const col = {
    name: marginX,
    qty: marginX + 92,
    unit: marginX + 116,
    subtotal: pageWidth - marginX,
  }

  doc.setFont('helvetica', 'bold')
  doc.text('Product', col.name, y)
  doc.text('Qty', col.qty, y)
  doc.text('Unit Price', col.unit, y)
  doc.text('Subtotal', col.subtotal, y, { align: 'right' })
  y += 3
  doc.setDrawColor(0, 0, 0)
  doc.line(marginX, y, pageWidth - marginX, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  order.items.forEach((item) => {
    const lineTotal = item.price * item.quantity
    doc.text(String(item.name), col.name, y, { maxWidth: col.qty - col.name - 4 })
    doc.text(String(item.quantity), col.qty, y)
    doc.text(pdfMoney(item.price), col.unit, y)
    doc.text(pdfMoney(lineTotal), col.subtotal, y, { align: 'right' })
    y += 8
  })

  y += 2
  doc.setDrawColor(230, 230, 230)
  doc.line(marginX, y, pageWidth - marginX, y)
  y += 10

  const itemsSubtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const serviceFee = order.total - itemsSubtotal

  doc.text('Subtotal', col.unit, y)
  doc.text(pdfMoney(itemsSubtotal), col.subtotal, y, { align: 'right' })
  y += 7

  doc.text('Service Fee', col.unit, y)
  doc.text(pdfMoney(serviceFee), col.subtotal, y, { align: 'right' })
  y += 9

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(220, 38, 38)
  doc.text('Total', col.unit, y)
  doc.text(pdfMoney(order.total), col.subtotal, y, { align: 'right' })
  doc.setTextColor(0, 0, 0)

  // Footer
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(140, 140, 140)
  doc.text(
    'Thank you for shopping with Metrolink. For inquiries contact us on WhatsApp: 08012345678',
    marginX,
    pageHeight - 18,
    { maxWidth: pageWidth - marginX * 2 }
  )

  doc.save(`Metrolink-Invoice-${invoiceNumber}.pdf`)
}

export default function OrderSuccessPage() {
  const location = useLocation()
  const order = location.state
  const user = useAuthStore((state) => state.user)

  const [downloading, setDownloading] = useState(false)

  const whatsappUrl = order
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(order))}`
    : null

  const handleDownloadInvoice = () => {
    if (!order || downloading) return

    setDownloading(true)

    // Brief delay so "Downloading..." is visible — PDF generation itself
    // is near-instant for a document this size.
    setTimeout(() => {
      buildInvoicePdf(order, user?.email)
      setDownloading(false)
    }, 500)
  }

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
            Thank you for shopping with Metrolink. Ready for pickup at our store.
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

              <p className="mt-2 text-xs text-zinc-500">
                Payment: {paymentMethodLabel(order.paymentMethod)}
              </p>
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

            {order && (
              <motion.button
                type="button"
                onClick={handleDownloadInvoice}
                disabled={downloading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 rounded-full border border-red-200 px-8 py-3 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={18} />
                {downloading ? 'Downloading...' : 'Download Invoice'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
