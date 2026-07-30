import { useEffect, useState } from 'react';

const LINES = [
  'JUHI-BIOS v2.6 (C) 1995 Damley Systems, Inc.',
  'Main Processor : Intel 80486DX2, 66 MHz',
  'Memory Test    : 65536 KB OK',
  '',
  'Detecting IDE drives ......... OK',
  'Loading personality .......... OK',
  'Initializing Game of Life .... OK',
  '',
  'Booting JUHI95 ...',
];
const LINE_INTERVAL_MS = 200;

const alreadyBooted = () => {
  try {
    return sessionStorage.getItem('booted') === '1';
  } catch {
    return true;
  }
};

const markBooted = () => {
  try {
    sessionStorage.setItem('booted', '1');
  } catch {
    // ignore
  }
};

export function BootScreen() {
  const [done, setDone] = useState(
    () => alreadyBooted() || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (done) {
      markBooted();
      return;
    }

    const finish = () => {
      markBooted();
      setDone(true);
    };

    const interval = window.setInterval(() => {
      setVisibleLines(n => {
        if (n >= LINES.length) {
          window.clearInterval(interval);
          window.setTimeout(finish, 500);
          return n;
        }
        return n + 1;
      });
    }, LINE_INTERVAL_MS);

    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [done]);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black p-6 md:p-10 cursor-pointer"
      style={{ fontFamily: '"Courier New", Courier, monospace' }}
      aria-hidden="true"
    >
      <div className="text-[#aaaaaa] text-xs md:text-sm leading-relaxed whitespace-pre">
        {LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i}>{line || ' '}</div>
        ))}
        <span className="inline-block w-2 h-3.5 bg-[#aaaaaa] align-middle" style={{ animation: 'blink-cursor 1s step-end infinite' }} />
      </div>
      <div className="absolute bottom-4 right-6 text-[#555555] text-xs">Press any key to skip</div>
    </div>
  );
}
