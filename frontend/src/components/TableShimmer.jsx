







export const TableShimmer = ({ rows = 5 }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
      
      {/* Header (hide on mobile) */}
      <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-white/5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-4 w-24 bg-white/5 rounded animate-pulse"
          />
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {Array.from({ length: rows }).map((_, i) => (
          
          <div key={i} className="px-4 py-4 md:px-6 md:py-4">
            
            {/* 📱 MOBILE VIEW (card style) */}
            <div className="flex flex-col gap-4 md:hidden">
              
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
                </div>
              </div>

              {/* Email */}
              <div className="h-3 w-3/4 bg-white/5 rounded animate-pulse" />

              {/* Bottom Row */}
              <div className="flex items-center justify-between">
                <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
                <div className="h-6 w-6 bg-white/5 rounded animate-pulse" />
              </div>
            </div>

            {/* 💻 DESKTOP VIEW (table/grid) */}
            <div className="hidden md:grid grid-cols-4 gap-4 items-center">
              
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
                </div>
              </div>

              {/* Email */}
              <div className="h-3 w-40 bg-white/5 rounded animate-pulse" />

              {/* Status */}
              <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />

              {/* Actions */}
              <div className="flex justify-end">
                <div className="h-6 w-6 bg-white/5 rounded animate-pulse" />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};