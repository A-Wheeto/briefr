const COLUMNS = ["Backlog", "Todo", "In Progress", "Review", "Done"];

const cardCounts = [2, 1, 3, 1, 2];

function SkeletonCard({ wide = false }: { wide?: boolean }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="px-3 pt-3 pb-2">
        <div className={`h-3 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse ${wide ? "w-4/5" : "w-3/5"}`} />
      </div>
      <div className="px-3 py-1.5 border-t border-gray-100 dark:border-gray-800">
        <div className="h-2.5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonColumn({ title, count }: { title: string; count: number }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col overflow-hidden">
      <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
          {title}
        </span>
        <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">
          {count}
        </span>
      </div>
      <div className="flex-1 p-2 flex flex-col gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} wide={i % 2 === 0} />
        ))}
      </div>
    </div>
  );
}

export default function BoardSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
      <div className="flex flex-col h-full md:hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
          {COLUMNS.map((col) => (
            <div key={col} className="flex-1 px-2 py-2.5 text-xs font-medium text-gray-300 dark:text-gray-700 text-center">
              {col}
            </div>
          ))}
        </div>
        <div className="flex-1 p-3 flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} wide={i % 2 === 0} />
          ))}
        </div>
      </div>

      {/* Desktop skeleton */}
      <div className="hidden md:grid md:grid-cols-5 gap-3 h-full p-4" style={{ minWidth: "900px" }}>
        {COLUMNS.map((col, i) => (
          <SkeletonColumn key={col} title={col} count={cardCounts[i]} />
        ))}
      </div>
    </>
  );
}
