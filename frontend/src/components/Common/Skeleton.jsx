import React from 'react';

export function NewsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      {/* Image Block */}
      <div className="w-full h-48 bg-gray-200 dark:bg-zinc-800"></div>
      
      {/* Body details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Category/Source tag */}
          <div className="w-1/4 h-3.5 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          {/* Title */}
          <div className="w-full h-5 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="w-5/6 h-5 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          {/* Snippet */}
          <div className="w-full h-3.5 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="w-2/3 h-3.5 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800/50">
          <div className="w-1/3 h-3.5 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-md animate-pulse grid grid-cols-1 lg:grid-cols-5 h-auto lg:h-[450px]">
      <div className="lg:col-span-3 bg-gray-200 dark:bg-zinc-800 h-64 lg:h-full"></div>
      <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-4 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="w-full h-7 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="w-full h-7 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="w-3/4 h-7 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="w-full h-4 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="w-5/6 h-4 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-6">
          <div className="w-24 h-4 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="w-16 h-8 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex space-x-3.5 pb-4 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 last:pb-0">
          <div className="w-16 h-16 bg-gray-200 dark:bg-zinc-800 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="w-full h-3.5 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
            <div className="w-2/3 h-3.5 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
            <div className="w-1/3 h-2.5 bg-gray-200 dark:bg-zinc-800 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
