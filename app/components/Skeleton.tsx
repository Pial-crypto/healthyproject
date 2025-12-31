

export function SkeletonList() {
  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="h-4 w-1/2 rounded shimmer" />
      <div className="h-3 w-3/4 rounded shimmer" />
      <div className="flex justify-between items-center">
        <div className="h-3 w-1/4 rounded shimmer" />
        <div className="h-8 w-24 rounded-md shimmer" />
      </div>
    </div>
  );
}
