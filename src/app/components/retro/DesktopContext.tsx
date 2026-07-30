import { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react';

export type DesktopWindow = {
  id: string;
  title: string;
  icon: string;
  minimized: boolean;
};

type DesktopApi = {
  windows: DesktopWindow[];
  register: (id: string, title: string, icon: string) => void;
  unregister: (id: string) => void;
  minimize: (id: string) => void;
  toggleMinimized: (id: string) => void;
  nextZ: () => number;
};

const DesktopContext = createContext<DesktopApi | null>(null);

// Null outside DesktopProvider — RetroWindow degrades to a static window.
export const useDesktop = () => useContext(DesktopContext);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<DesktopWindow[]>([]);
  const zRef = useRef(20);

  const register = useCallback((id: string, title: string, icon: string) => {
    setWindows(ws => (ws.some(w => w.id === id) ? ws : [...ws, { id, title, icon, minimized: false }]));
  }, []);

  const unregister = useCallback((id: string) => {
    setWindows(ws => ws.filter(w => w.id !== id));
  }, []);

  const minimize = useCallback((id: string) => {
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const toggleMinimized = useCallback((id: string) => {
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, minimized: !w.minimized } : w)));
  }, []);

  const nextZ = useCallback(() => ++zRef.current, []);

  return (
    <DesktopContext.Provider value={{ windows, register, unregister, minimize, toggleMinimized, nextZ }}>
      {children}
    </DesktopContext.Provider>
  );
}
