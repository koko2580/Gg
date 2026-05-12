import { useState } from "react";
import { Link2, LayoutTemplate, Copy, DownloadCloud, PlayCircle, History } from "lucide-react";
import Screen from "../components/layout/Screen";
import { useAppStore } from "../store/useAppStore";
import { cn } from "../lib/utils";
import { showRewardedVideo } from "../services/adMobService";

export default function Home() {
  const [url, setUrl] = useState("");
  const { addDownload, downloads } = useAppStore();
  const [format, setFormat] = useState<'mp4' | 'mp3'>('mp4');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleDownload = () => {
    if (!url) return;
    showRewardedVideo(() => {
      addDownload(url, format);
      setUrl("");
    }, () => {
      // Fallback if ad fails or not ready
      addDownload(url, format);
      setUrl("");
    });
  };

  const recentDownloads = downloads.filter(d => !d.isVaulted).slice(0, 3);

  return (
    <Screen title="TokSave AI">
      {/* Input Section */}
      <div className="neumorph rounded-3xl p-6 mt-4 flex flex-col gap-6">
        <div className="relative">
          <div className="neumorph-inset rounded-2xl flex items-center p-1 pr-3">
            <input
              type="text"
              placeholder="Paste Video Link Here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm"
            />
            {url ? (
              <button 
                onClick={() => setUrl("")}
                className="text-gray-500 p-2 hover:text-white transition-colors"
              >
                ✕
              </button>
            ) : (
              <button 
                onClick={handlePaste}
                className="neumorph p-2 rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 text-xs font-semibold px-4"
              >
                <Copy className="w-4 h-4" /> Paste
              </button>
            )}
          </div>
        </div>

        {/* Format Selector */}
        <div className="flex gap-4">
          <button
            onClick={() => setFormat('mp4')}
            className={cn(
              "flex-1 py-3 rounded-xl font-semibold transition-all text-sm",
              format === 'mp4' ? "neumorph-inset text-[var(--color-primary)]" : "neumorph text-gray-400"
            )}
          >
            Video (MP4)
          </button>
          <button
            onClick={() => setFormat('mp3')}
            className={cn(
              "flex-1 py-3 rounded-xl font-semibold transition-all text-sm",
              format === 'mp3' ? "neumorph-inset text-[var(--color-primary)]" : "neumorph text-gray-400"
            )}
          >
            Audio (MP3)
          </button>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!url}
          className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-black font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(0,242,254,0.3)] hover:shadow-[0_15px_25px_rgba(0,242,254,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          <DownloadCloud className="w-6 h-6 stroke-[2.5]" />
          Download Now
        </button>
      </div>

      {/* Supported Platforms */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-400 mb-4 px-2 uppercase tracking-wider">Supported Platforms</h3>
        <div className="flex justify-between px-2 gap-4">
          {['TikTok', 'Instagram', 'Shorts', 'Facebook'].map(plat => (
            <div key={plat} className="flex flex-col items-center gap-2">
              <div className="neumorph w-14 h-14 rounded-2xl flex items-center justify-center text-[var(--color-primary)]">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium text-gray-400">{plat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Downloads */}
      {recentDownloads.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4" /> Recent
            </h3>
            <span className="text-[10px] text-[var(--color-primary)]">View All</span>
          </div>
          <div className="flex flex-col gap-4">
            {recentDownloads.map(dl => (
              <div key={dl.id} className="neumorph p-3 rounded-2xl flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#2a2f3a] relative">
                  {dl.thumbnail ? (
                    <img src={dl.thumbnail} alt={dl.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  {dl.status === 'downloading' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-xs font-bold text-[var(--color-primary)]">{dl.progress}%</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-semibold truncate text-gray-200">{dl.title}</h4>
                  <p className="text-xs text-gray-500 truncate mt-1">{dl.url || "No URL"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Screen>
  );
}
