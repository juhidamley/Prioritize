import { KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

type MenuItem = {
  label: string;
  icon: string;
  to?: string;
  href?: string;
  action?: () => void;
  external?: boolean;
};

const SEPARATOR = null;

export function StartMenu({ onClose, onShutDown }: { onClose: () => void; onShutDown: () => void }) {
  const navigate = useNavigate();
  const [focusIndex, setFocusIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const items: (MenuItem | typeof SEPARATOR)[] = [
    {
      label: 'Ask AI Juhi',
      icon: '🤖',
      action: () => {
        onClose();
        window.dispatchEvent(new Event('open-ai-juhi'));
      },
    },
    SEPARATOR,
    { label: 'Projects', icon: '📁', to: '/projects' },
    { label: 'Research', icon: '📊', to: '/research' },
    { label: 'Study Tools', icon: '📚', to: '/studyTools' },
    { label: 'Prioritize', icon: '⚡', href: 'https://ptz.juhi.studio', external: true },
    { label: 'LectureTeX', icon: '🎓', href: 'https://lecturetex.juhi.studio', external: true },
    { label: 'devlog', icon: '📝', href: 'https://devlog.juhi.studio', external: true },
    SEPARATOR,
    { label: 'Resume', icon: '📄', to: '/resume' },
    { label: 'About', icon: '👤', to: '/about' },
    { label: 'Links', icon: '🌐', to: '/links' },
    { label: 'Contact', icon: '✉️', to: '/contact' },
    SEPARATOR,
    { label: 'Desktop', icon: '🖥️', to: '/home' },
    SEPARATOR,
    { label: 'Shut Down...', icon: '🔌', action: onShutDown },
  ];
  const actionable = items.filter((i): i is MenuItem => i !== SEPARATOR);

  useEffect(() => {
    itemRefs.current[focusIndex]?.focus();
  }, [focusIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const activate = (item: MenuItem) => {
    if (item.action) {
      item.action();
      return;
    }
    onClose();
    if (item.href) {
      window.location.href = item.href;
    } else if (item.to) {
      navigate(item.to);
    }
  };

  const onMenuKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIndex(i => (i + 1) % actionable.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIndex(i => (i - 1 + actionable.length) % actionable.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusIndex(actionable.length - 1);
    }
  };

  let buttonIndex = -1;

  return (
    <>
      {/* Click-outside overlay (also swallows a second Start click, closing the menu) */}
      <div className="fixed inset-0 z-[55]" onClick={onClose} aria-hidden="true" />

      <div
        role="menu"
        aria-label="Start menu"
        onKeyDown={onMenuKeyDown}
        className="fixed bottom-11 left-1 z-[60] flex bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black shadow-2xl min-w-52"
      >
        {/* Vertical banner */}
        <div className="bg-gradient-to-t from-[#000080] to-[#1084d0] w-7 flex items-end justify-center py-2 shrink-0" aria-hidden="true">
          <span
            className="text-white font-bold tracking-[0.2em] text-sm whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            JUHI<span className="text-[#c0c0c0]">95</span>
          </span>
        </div>

        <div className="flex-1 py-1">
          {items.map((item, i) => {
            if (item === SEPARATOR) {
              return (
                <div key={`sep-${i}`} className="mx-1 my-1 border-t border-gray-500 border-b border-b-white" aria-hidden="true" />
              );
            }
            buttonIndex++;
            const idx = buttonIndex;
            return (
              <button
                key={item.label}
                ref={el => { itemRefs.current[idx] = el; }}
                role="menuitem"
                onClick={() => activate(item)}
                onMouseEnter={() => setFocusIndex(idx)}
                className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-black text-left hover:bg-[#000080] hover:text-white focus:bg-[#000080] focus:text-white focus:outline-none"
              >
                <span className="text-base w-5 text-center" aria-hidden="true">{item.icon}</span>
                <span className="flex-1 whitespace-nowrap">{item.label}</span>
                {item.external && <span className="text-xs opacity-60" aria-hidden="true">↗</span>}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
