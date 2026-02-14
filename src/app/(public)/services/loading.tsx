export default function ServicesLoading() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-60 animate-pulse rounded bg-secondary/60" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-secondary/50" />
        <div className="mt-12 grid gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-border/50 p-6">
              <div className="h-7 w-40 animate-pulse rounded bg-secondary/60" />
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-secondary/50" />
              <div className="mt-2 h-4 w-11/12 animate-pulse rounded bg-secondary/50" />
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((__, tierIndex) => (
                  <div key={tierIndex} className="h-16 animate-pulse rounded-xl bg-secondary/50" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
