import Screen from "../components/layout/Screen";
import { useAppStore } from "../store/useAppStore";
import { cn } from "../lib/utils";
import { Moon, Download, HardDrive, Bell, Info, Shield } from "lucide-react";

export default function Settings() {
  const { settings, updateSettings } = useAppStore();

  return (
    <Screen title="Settings">
      <div className="flex flex-col gap-6 mt-4">
        
        {/* App Settings */}
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">App Preferences</h3>
          <div className="neumorph rounded-3xl p-2 flex flex-col">
            
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="neumorph-inset p-2 rounded-xl text-blue-400">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">Dark Mode</h4>
                  <p className="text-[10px] text-gray-500">Force dark theme everywhere</p>
                </div>
              </div>
              <button 
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors",
                  settings.darkMode ? "bg-[var(--color-primary)]" : "bg-gray-700"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                  settings.darkMode ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="neumorph-inset p-2 rounded-xl text-green-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">Auto Download</h4>
                  <p className="text-[10px] text-gray-500">Detect copied links automatically</p>
                </div>
              </div>
              <button 
                onClick={() => updateSettings({ autoDownload: !settings.autoDownload })}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors",
                  settings.autoDownload ? "bg-[var(--color-primary)]" : "bg-gray-700"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                  settings.autoDownload ? "right-1" : "left-1"
                )} />
              </button>
            </div>

          </div>
        </section>

        {/* Quality */}
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Default Quality</h3>
          <div className="neumorph rounded-3xl p-2 flex bg-[#0f1115]">
            {['hd', 'sd'].map(quality => (
               <button 
                key={quality}
                onClick={() => updateSettings({ defaultQuality: quality as any })}
                className={cn(
                  "flex-1 py-3 text-sm font-semibold uppercase tracking-wider rounded-2xl transition-all",
                  settings.defaultQuality === quality ? "neumorph-inset text-[var(--color-primary)]" : "text-gray-500 hover:text-gray-300"
                )}
               >
                 {quality}
               </button>
            ))}
          </div>
        </section>

        {/* System */}
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">About & Info</h3>
          <div className="neumorph rounded-3xl p-2 flex flex-col">
            
            <div className="flex items-center gap-3 p-4 border-b border-white/5 active:neumorph-inset rounded-t-2xl transition-all">
               <div className="text-gray-400"><HardDrive className="w-5 h-5" /></div>
               <h4 className="text-sm font-semibold text-gray-200 flex-1">Storage Path</h4>
               <span className="text-xs text-gray-500">/Internal/TokSave</span>
            </div>

            <div className="flex items-center gap-3 p-4 border-b border-white/5 active:neumorph-inset transition-all">
               <div className="text-gray-400"><Shield className="w-5 h-5" /></div>
               <h4 className="text-sm font-semibold text-gray-200 flex-1">Privacy Policy</h4>
            </div>

             <div className="flex items-center gap-3 p-4 active:neumorph-inset rounded-b-2xl transition-all">
               <div className="text-gray-400"><Info className="w-5 h-5" /></div>
               <h4 className="text-sm font-semibold text-gray-200 flex-1">App Version</h4>
               <span className="text-xs text-[var(--color-primary)]">v2.1.0</span>
            </div>

          </div>
        </section>

      </div>
    </Screen>
  );
}
