export type DownloadItem = {
  id: string;
  url: string;
  title: string;
  thumbnail?: string;
  status: 'downloading' | 'completed' | 'failed';
  progress: number;
  format: 'mp4' | 'mp3';
  quality: string;
  timestamp: number;
  platform: 'tiktok' | 'instagram' | 'youtube' | 'unknown';
  isVaulted: boolean;
};

export type AppSettings = {
  defaultQuality: 'hd' | 'sd' | 'audio';
  autoDownload: boolean;
  darkMode: boolean;
};
