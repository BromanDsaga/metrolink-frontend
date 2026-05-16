export default function ProductArt({ product, large = false }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl bg-zinc-100 ${
        large ? 'h-80' : 'h-36'
      }`}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.target.src =
            'https://images.unsplash.com/photo-1542838132-92c53300491e'
        }}
      />
    </div>
  )
}