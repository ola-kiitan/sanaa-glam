export default function BookingLoading() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-72 animate-pulse rounded bg-secondary/60" />
        <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-secondary/50" />

        <div className="mt-10 rounded-xl border border-border/50 bg-card p-5">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-secondary/60" />
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border/50 p-6">
          <div className="h-7 w-56 animate-pulse rounded bg-secondary/60" />
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-secondary/50" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
