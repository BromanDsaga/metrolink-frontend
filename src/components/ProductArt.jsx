export default function ProductArt({ product, large = false }) {
  return (
    <div className={`relative grid overflow-hidden rounded-2xl bg-gradient-to-br ${product.palette} ${large ? 'h-80' : 'h-36'} place-items-center`}>
      <div className={`absolute inset-x-6 bottom-5 rounded-2xl ${product.accent} ${large ? 'h-52' : 'h-24'} shadow-lg`} />
      <div className="relative z-10 w-[72%] text-center text-white">
        <div className={`${large ? 'text-3xl' : 'text-base'} font-black uppercase tracking-tight`}>{product.name.split(' ')[0]}</div>
        <div className={`${large ? 'mt-2 text-sm' : 'mt-1 text-[10px]'} opacity-90`}>{product.size}</div>
      </div>
    </div>
  )
}
