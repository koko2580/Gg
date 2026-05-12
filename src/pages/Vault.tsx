import { useState, useEffect } from "react";
import Screen from "../components/layout/Screen";
import DownloadCard from "../components/DownloadCard";
import { useAppStore } from "../store/useAppStore";
import { Lock, Unlock } from "lucide-react";

export default function Vault() {
  const { downloads } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInfo, setPinInfo] = useState<string>(''); // would realistically be stored securely
  
  // Realistically we'd use a robust system, but for POC we use a fake PIN 1234
  const handlePin = (code: string) => {
    if (code === '1234') setIsAuthenticated(true);
  };

  const vaulted = downloads.filter(d => d.isVaulted);

  if (!isAuthenticated) {
    return (
      <Screen title="Private Vault">
        <div className="flex flex-col items-center justify-center mt-20 gap-8">
           <div className="neumorph p-8 rounded-full w-fit mb-4">
              <Lock className="w-12 h-12 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-200">Enter PIN</h2>
            <p className="text-sm text-gray-500 -mt-6">Default PIN is 1234</p>
            
            <div className="flex gap-4">
              {[1,2,3,4].map((i) => (
                 <div key={i} className="neumorph-inset w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-[var(--color-primary)]">
                    {pinInfo.length >= i ? '*' : ''}
                 </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">
              {[1,2,3,4,5,6,7,8,9].map((num) => (
                <button 
                  key={num}
                  onClick={() => {
                    const newPin = pinInfo + num;
                    setPinInfo(newPin);
                    if (newPin.length === 4) handlePin(newPin);
                  }}
                  className="neumorph w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-gray-300 hover:text-[var(--color-primary)] active:neumorph-inset"
                >
                  {num}
                </button>
              ))}
              <div />
               <button 
                  onClick={() => {
                    const newPin = pinInfo + "0";
                    setPinInfo(newPin);
                    if (newPin.length === 4) handlePin(newPin);
                  }}
                  className="neumorph w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-gray-300 hover:text-[var(--color-primary)] active:neumorph-inset"
                >
                  0
                </button>
                 <button 
                  onClick={() => setPinInfo(pinInfo.slice(0, -1))}
                  className="w-16 h-16 flex items-center justify-center text-sm font-bold text-gray-500"
                >
                  DEL
                </button>
            </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen title="Private Vault">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-purple-400 font-semibold">{vaulted.length} SECURE FILES</span>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="neumorph p-2 rounded-xl text-gray-400 hover:text-white"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {vaulted.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 flex flex-col items-center gap-4">
            <p>Vault is empty.</p>
          </div>
        ) : (
          vaulted.map(d => (
            <DownloadCard key={d.id} item={d} />
          ))
        )}
      </div>
    </Screen>
  );
}
