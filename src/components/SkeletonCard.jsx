export default function SkeletonCard() {
  return (
    <div className="surface animate-pulse p-3">
      <div className="h-36 rounded-2xl bg-zinc-100" />
      <div className="mt-4 h-4 w-3/4 rounded bg-zinc-100" />
      <div className="mt-2 h-3 w-1/3 rounded bg-zinc-100" />
      <div className="mt-4 h-8 rounded-full bg-zinc-100" />
    </div>
  )
}
