import Screen from "../components/layout/Screen";
import DownloadCard from "../components/DownloadCard";
import { useAppStore } from "../store/useAppStore";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { downloads, favorites } = useAppStore();

  const favDownloads = downloads.filter(d => !d.isVaulted && favorites.includes(d.id));

  return (
    <Screen title="Favorites">
      <div className="flex flex-col gap-5 mt-4">
        {favDownloads.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 flex flex-col items-center gap-4">
            <div className="neumorph p-6 rounded-3xl w-fit">
              <Heart className="w-8 h-8 text-[#ff0050]" />
            </div>
            <p>No favorites yet.</p>
          </div>
        ) : (
          favDownloads.map(d => (
            <DownloadCard key={d.id} item={d} />
          ))
        )}
      </div>
    </Screen>
  );
}
