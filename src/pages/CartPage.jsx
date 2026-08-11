import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import ProductArt from '../components/ProductArt'
import { money } from '../data'
import { useCartStore } from '../store/cartStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCartStore()
  const serviceFee = items.length ? 500 : 0
  const total = subtotal() + serviceFee

  return (
    <PageTransition>
      <div className="container-shell grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="surface p-5">
          <h1 className="text-2xl font-black">Your Cart</h1>
          <div className="mt-6 space-y-4">
            {items.length === 0 && <p className="text-sm text-zinc-500">Your cart is empty.</p>}
            {items.map((item) => (
              <div key={item.id} className="grid gap-4 border-b border-zinc-100 pb-4 sm:grid-cols-[96px_1fr_auto] sm:items-center">
                <div className="[&>div]:h-24"><ProductArt product={item} /></div>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-zinc-500">{item.size}</p>
                  <p className="mt-2 font-bold">{money(item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-zinc-200">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid h-10 w-10 place-items-center"><Minus size={15} /></button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid h-10 w-10 place-items-center"><Plus size={15} /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="grid h-10 w-10 place-items-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
          {items.length > 0 && <button onClick={clearCart} className="mt-6 text-sm font-semibold text-zinc-500">Clear Cart</button>}
        </section>

        <aside className="surface h-fit p-5">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span>{money(subtotal())}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Service Fee</span><span>{money(serviceFee)}</span></div>
            <p className="text-xs text-zinc-400">Service fee covers order processing</p>
            <div className="flex justify-between border-t border-zinc-100 pt-3 text-base font-bold"><span>Total</span><span className="text-red-600">{money(total)}</span></div>
          </div>
          <Link to="/checkout" className="mt-6 block rounded-full bg-red-600 px-5 py-3 text-center font-semibold text-white">Proceed to Checkout</Link>
          <Link to="/products" className="mt-3 block text-center text-sm font-semibold text-red-600">Continue Shopping</Link>
        </aside>
      </div>
    </PageTransition>
  )
}
