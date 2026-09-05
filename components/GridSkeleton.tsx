import SkeletonCard from './SkeletonCard'

export default function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {Array.from({ length: 20 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
