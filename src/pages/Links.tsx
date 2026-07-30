import { useNavigate } from 'react-router';
import { RetroWindow } from '../app/components/retro/RetroWindow';
import { Taskbar } from '../app/components/retro/Taskbar';

const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/juhidamley', icon: '💾' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/juhidamley', icon: '👔' },
  { name: 'Email', url: 'mailto:jdamley28@cmc.edu', icon: '📧' },
  { name: 'HackerRank', url: 'https://www.hackerrank.com/juhidamley', icon: '🏆' },
  { name: 'Kaggle', url: 'https://www.kaggle.com/juhidamley', icon: '📊' },
];

export function Links() {
  const navigate = useNavigate();

  return (
    // Synthwave Grid Background
    <div className="min-h-screen w-full bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-center justify-center p-4 pb-16 relative overflow-hidden font-sans">
      <h1 className="sr-only">Links — Juhi Damley</h1>

      {/* Glowing Sun Effect behind the window */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-b from-yellow-400 to-pink-600 rounded-full blur-[60px] opacity-40 pointer-events-none" />

      <RetroWindow
        title="links.exe"
        icon="🌐"
        windowId="links"
        className="w-full max-w-md z-10"
        onClose={() => navigate('/')}
      >
        <div className="px-4 py-4 flex flex-col items-center">
          {/* Profile Section */}
          <div className="w-24 h-24 mb-4 border-t-2 border-l-2 border-b-2 border-r-2 border-t-black border-l-black border-b-white border-r-white p-1 bg-white">
            <img
              src="/juhistudioicon.png"
              alt="Juhi Damley"
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>

          <p className="text-black font-bold text-lg mb-1">Juhi Damley</p>
          <p className="text-[#6b6b6b] text-sm mb-6 font-semibold">Computer Science Student</p>

          {/* Buttons Area */}
          <div className="w-full flex flex-col gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith('/') ? '_self' : '_blank'}
                rel={link.url.startsWith('/') ? '' : 'noopener noreferrer'}
                className="w-full bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black px-4 py-2 text-black font-bold text-center hover:bg-[#d4d4d4] active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:bg-[#a0a0a0] flex items-center justify-center gap-2 transition-none"
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </RetroWindow>

      <Taskbar />
    </div>
  );
}
