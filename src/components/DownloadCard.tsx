import React from "react";
import { DownloadItem } from "../types";
import { PlayCircle, Trash2, Heart, Share2, Lock, Unlock } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { cn } from "../lib/utils";

export default function DownloadCard({ item }: { key?: React.Key, item: DownloadItem }) {
  const { removeDownload, toggleFavorite, favorites, toggleVault } = useAppStore();
  const isFav = favorites.includes(item.id);

  return (
    <div className="neumorph p-4 rounded-3xl flex flex-col gap-3">
      <div className="flex gap-4">
        <div className="w-24 h-32 rounded-2xl overflow-hidden bg-[#2a2f3a] relative flex-shrink-0">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlayCircle className="w-8 h-8 text-gray-600" />
            </div>
          )}
          {item.status === 'downloading' && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-bold text-[var(--color-primary)]">{item.progress}%</span>
              <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-primary)] shadow-[0_0_10px_rgba(0,242,254,0.5)] transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase text-[var(--color-primary)]">
            {item.format}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col pt-1 overflow-hidden">
          <h4 className="text-base font-semibold truncate text-gray-100 mb-1">{item.title}</h4>
          <p className="text-xs text-gray-500 truncate mb-3">{item.platform.toUpperCase()}</p>
          
          <div className="mt-auto flex justify-between items-center pr-2">
             <button 
                onClick={() => toggleFavorite(item.id)}
                className={cn(
                  "neumorph p-2.5 rounded-xl transition-all",
                  isFav ? "text-[var(--color-accent)] neumorph-inset" : "text-gray-400 hover:text-[var(--color-accent)]"
                )}
              >
                <Heart className={cn("w-4 h-4", isFav && "fill-current")} />
              </button>
              <button 
                onClick={() => toggleVault(item.id)}
                className={cn(
                  "neumorph p-2.5 rounded-xl transition-all",
                  item.isVaulted ? "text-purple-400 neumorph-inset" : "text-gray-400 hover:text-purple-400"
                )}
              >
                {item.isVaulted ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
               <button 
                className="neumorph p-2.5 rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => removeDownload(item.id)}
                className="neumorph p-2.5 rounded-xl text-gray-400 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
