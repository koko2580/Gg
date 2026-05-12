import { ReactNode } from "react";
import { motion } from "motion/react";
import BottomNav from "./BottomNav";

interface ScreenProps {
  children: ReactNode;
  title?: string;
  hideNav?: boolean;
}

export default function Screen({ children, title, hideNav = false }: ScreenProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center relative overflow-hidden">
      {/* Decorative gradient glowing orb */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[var(--color-primary)] opacity-5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-accent)] opacity-5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md flex-1 flex flex-col relative z-10">
        {title && (
          <header className="px-6 py-8 pb-4 sticky top-0 bg-[var(--color-background)]/80 backdrop-blur-md z-40">
            <h1 className="text-3xl font-bold tracking-tight text-gradient">{title}</h1>
          </header>
        )}
        
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-1 overflow-y-auto px-4 pb-32"
        >
          {children}
        </motion.main>
      </div>

      {!hideNav && <BottomNav />}
    </div>
  );
}
