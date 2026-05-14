import { NavLink } from "react-router-dom";
import { Copy, Download, Heart, Lock, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

export default function BottomNav() {
  const tabs = [
    { to: "/", icon: Copy, label: "Home" },
    { to: "/downloads", icon: Download, label: "Manager" },
    { to: "/favorites", icon: Heart, label: "Favorites" },
    { to: "/vault", icon: Lock, label: "Vault" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const isNative = typeof window !== 'undefined' && (window as any).Capacitor && (window as any).Capacitor.isNativePlatform();

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 p-4 z-50", isNative ? "pb-[70px]" : "pb-6")}>
      <div className="bg-[#161a20]/80 backdrop-blur-xl border border-white/5 shadow-[10px_10px_20px_#07080a,-10px_-10px_20px_#252c36] flex justify-around items-center p-3 rounded-[24px] mx-auto max-w-md">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 w-14 h-14",
                isActive 
                  ? "neumorph-inset text-[var(--color-primary)]" 
                  : "text-gray-500 hover:text-gray-300 neumorph-active"
              )
            }
          >
            <tab.icon className="w-6 h-6 stroke-[1.5]" />
          </NavLink>
        ))}
      </div>
    </div>
  );
}
