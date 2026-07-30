import { useEffect, useState } from 'react';
import { AiJuhiChat } from './AiJuhiChat';

// Global floating launcher for the AI Juhi chat. Mounted once in AppShell so it's
// reachable on every route, including mobile (unlike the desktop-only terminal).
// The Start menu opens it by dispatching a window 'open-ai-juhi' event.
export function ChatLauncher() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener('open-ai-juhi', openIt);
    return () => window.removeEventListener('open-ai-juhi', openIt);
  }, []);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Chat with AI Juhi"
          className="fixed bottom-14 right-4 z-[75] flex items-center gap-2 bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-3 py-2 font-bold text-black text-sm shadow-xl active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-[#d4d4d4]"
        >
          <span className="text-lg leading-none" aria-hidden="true">🤖</span>
          <span className="hidden sm:inline">Ask AI Juhi</span>
        </button>
      )}
      {open && <AiJuhiChat onClose={() => setOpen(false)} />}
    </>
  );
}
