export default function ProductArt({ product, large = false }) {
  const image = product.imageUrl || product.image_url || product.image

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-zinc-100 ${
        large ? 'h-80' : 'h-36'
      }`}
    >
      {image ? (
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1542838132-92c53300491e'
          }}
        />
      ) : (
        <div className="grid h-full place-items-center text-sm font-semibold text-zinc-400">
          {product.name}
        </div>
      )}
    </div>
  )
}