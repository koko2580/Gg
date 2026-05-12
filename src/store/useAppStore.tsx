import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DownloadItem, AppSettings } from '../types';

interface AppContextType {
  downloads: DownloadItem[];
  favorites: string[]; // array of download IDs
  settings: AppSettings;
  addDownload: (url: string, format: 'mp4' | 'mp3', quality?: string) => void;
  removeDownload: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleVault: (id: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  defaultQuality: 'hd',
  autoDownload: false,
  darkMode: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load from local storage
  useEffect(() => {
    try {
      const savedDownloads = localStorage.getItem('toksave_downloads');
      if (savedDownloads) setDownloads(JSON.parse(savedDownloads));

      const savedFavorites = localStorage.getItem('toksave_favorites');
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

      const savedSettings = localStorage.getItem('toksave_settings');
      if (savedSettings) setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    } catch (e) {
      console.error("Storage load error", e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('toksave_downloads', JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem('toksave_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('toksave_settings', JSON.stringify(settings));
  }, [settings]);

  const detectPlatform = (url: string): DownloadItem['platform'] => {
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    return 'unknown';
  };

  const addDownload = (url: string, format: 'mp4' | 'mp3', quality = settings.defaultQuality) => {
    const newDownload: DownloadItem = {
      id: Date.now().toString(),
      url,
      title: 'Downloading...',
      status: 'downloading',
      progress: 0,
      format,
      quality,
      timestamp: Date.now(),
      platform: detectPlatform(url),
      isVaulted: false,
    };

    setDownloads(prev => [newDownload, ...prev]);

    // Process actual download
    processDownload(newDownload.id, url, format);
  };

  const processDownload = async (id: string, url: string, format: string) => {
    try {
      const isCapacitor = window.location.origin.includes('localhost') || window.location.protocol === 'capacitor:';
      const baseUrl = isCapacitor ? 'https://ais-pre-n4wyrew4fjm2z5zcz5sbnw-436071492721.asia-southeast1.run.app' : '';

      // 1. Extract URL via backend
      const extractRes = await fetch(`${baseUrl}/api/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, format })
      });
      
      if (!extractRes.ok) throw new Error("Extraction failed");
      const extractData = await extractRes.json();
      
      setDownloads(prev => prev.map(d => d.id === id ? {
        ...d,
        title: extractData.title || `TokSave_Video_${Date.now()}`,
        thumbnail: extractData.thumbnail || d.thumbnail,
        progress: 10
      } : d));

      if (!extractData.url) {
        throw new Error("No URL returned from extraction API");
      }
      // 2. Fetch the actual blob to bypass CORS & save
      const proxyUrl = `${baseUrl}/api/download-blob?url=${encodeURIComponent(extractData.url)}`;
      
      let progress = 10;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5);
        if (progress > 90) progress = 90;
        setDownloads(prev => prev.map(d => d.id === id && d.status === 'downloading' ? { ...d, progress } : d));
      }, 500);

      const blobRes = await fetch(proxyUrl);
      clearInterval(interval);
      
      if (!blobRes.ok) {
        const errText = await blobRes.text();
        throw new Error(`Blob fetch failed: ${errText}`);
      }
      const blob = await blobRes.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      // Trigger actual browser download
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `TokSave_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      // Keep object url valid for a while, ideally should handle cleanup better in a real app
      setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);

      setDownloads(prev => prev.map(d => d.id === id ? {
        ...d,
        status: 'completed',
        progress: 100,
        // Optional: you can store objectUrl here for previews, but it gets invalid on refresh
        // For POC, we'll keep the original url in state but mark it completed
      } : d));

    } catch (e) {
      console.error(e);
      setDownloads(prev => prev.map(d => d.id === id ? {
        ...d,
        status: 'failed',
        title: 'Download Failed'
      } : d));
    }
  };

  const removeDownload = (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
    setFavorites(prev => prev.filter(fId => fId !== id));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const toggleVault = (id: string) => {
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, isVaulted: !d.isVaulted } : d));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider value={{ downloads, favorites, settings, addDownload, removeDownload, toggleFavorite, toggleVault, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
