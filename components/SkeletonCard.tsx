export default function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm animate-pulse">
      <div className="aspect-[2/3] bg-gray-200" />
      <div className="p-3 space-y-2" style={{ minHeight: '72px' }}>
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}
