import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const back = () => navigate('/');
    window.addEventListener('keydown', back);
    window.addEventListener('pointerdown', back);
    return () => {
      window.removeEventListener('keydown', back);
      window.removeEventListener('pointerdown', back);
    };
  }, [navigate]);

  return (
    <main
      className="fixed inset-0 bg-[#0000aa] text-white flex items-center justify-center p-6 cursor-pointer select-none"
      style={{ fontFamily: '"Courier New", Courier, monospace' }}
    >
      <div className="max-w-2xl w-full text-sm md:text-base leading-relaxed">
        <h1 className="text-center mb-8">
          <span className="bg-[#aaaaaa] text-[#0000aa] px-3 font-bold">&nbsp;JUHI95&nbsp;</span>
        </h1>

        <p className="mb-6">
          A fatal exception 404 has occurred at 0028:C0DE0404 in module JUHI95.DLL. The page at{' '}
          <span className="break-all">{pathname}</span> could not be found.
        </p>

        <ul className="mb-6 space-y-2">
          <li>* &nbsp;Press any key (or click) to return to the terminal.</li>
          <li>* &nbsp;Press CTRL+ALT+DEL to restart your visit. You will lose zero unsaved information. It's a website.</li>
        </ul>

        <p className="text-center">
          Press any key to continue{' '}
          <span
            className="inline-block w-2.5 h-4 bg-white align-middle"
            style={{ animation: 'blink-cursor 1s step-end infinite' }}
          />
        </p>
      </div>
    </main>
  );
}
