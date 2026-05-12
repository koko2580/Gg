import { useState } from "react";
import Screen from "../components/layout/Screen";
import DownloadCard from "../components/DownloadCard";
import { useAppStore } from "../store/useAppStore";
import { cn } from "../lib/utils";
import { Filter } from "lucide-react";

export default function Downloads() {
  const { downloads } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'mp4' | 'mp3'>('all');

  const visibleDownloads = downloads.filter(d => !d.isVaulted && (filter === 'all' || d.format === filter));

  return (
    <Screen title="Manager">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {['all', 'mp4', 'mp3'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
               "flex-1 py-2.5 rounded-xl font-semibold transition-all text-xs uppercase tracking-wider",
              filter === f ? "neumorph-inset text-[var(--color-primary)]" : "neumorph text-gray-400"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {visibleDownloads.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 flex flex-col items-center gap-4">
            <div className="neumorph p-6 rounded-3xl w-fit">
              <Filter className="w-8 h-8 text-gray-600" />
            </div>
            <p>No downloads found.</p>
          </div>
        ) : (
          visibleDownloads.map(d => (
            <DownloadCard key={d.id} item={d} />
          ))
        )}
      </div>
    </Screen>
  );
}
