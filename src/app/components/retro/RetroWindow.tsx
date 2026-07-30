import { ReactNode, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import { useDesktop } from './DesktopContext';

const CONTROL_BTN =
  'bg-[#c0c0c0] w-4 h-4 border-t border-l border-t-white border-l-white border-b-black border-r-black text-black font-bold text-[10px] leading-none active:border-t-black active:border-l-black active:border-b-white active:border-r-white items-center justify-center';

export type RetroWindowProps = {
  title: string;
  icon: string;
  children: ReactNode;
  className?: string;
  /** Extra classes for the content area (e.g. 'p-1 md:p-2'). */
  bodyClassName?: string;
  onClose?: () => void;
  /** When set (and inside DesktopProvider), the window registers with the
   *  taskbar and its minimize button becomes functional. */
  windowId?: string;
};

export const RetroWindow = ({
  title,
  icon,
  children,
  className = '',
  bodyClassName = '',
  onClose,
  windowId,
}: RetroWindowProps) => {
  const desktop = useDesktop();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [maximized, setMaximized] = useState(false);
  const [z, setZ] = useState<number | undefined>(undefined);
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  const registered = Boolean(windowId && desktop);
  const minimized = registered
    ? desktop!.windows.find(w => w.id === windowId)?.minimized ?? false
    : false;

  useEffect(() => {
    if (!windowId || !desktop) return;
    desktop.register(windowId, title, icon);
    return () => desktop.unregister(windowId);
    // register/unregister are stable; re-registering on title change is unnecessary
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowId]);

  const bringToFront = () => {
    if (desktop) setZ(desktop.nextZ());
  };

  const onTitlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (maximized) return;
    if ((e.target as HTMLElement).closest('button')) return;
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: pos.x, baseY: pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onTitlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    setPos({ x: d.baseX + e.clientX - d.startX, y: d.baseY + e.clientY - d.startY });
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  return (
    <section
      role="region"
      aria-label={title}
      onPointerDown={bringToFront}
      className={`bg-[#c0c0c0] border-t-2 border-l-2 border-b-2 border-r-2 border-t-white border-l-white border-b-black border-r-black flex flex-col shadow-xl ${
        maximized ? 'fixed left-2 right-2 top-2 bottom-12 z-40' : ''
      } ${className}`}
      style={{
        display: minimized ? 'none' : undefined,
        transform: !maximized && (pos.x || pos.y) ? `translate(${pos.x}px, ${pos.y}px)` : undefined,
        zIndex: z,
        ...(maximized
          ? { maxWidth: 'none', width: 'auto', height: 'auto', margin: 0 }
          : z !== undefined
            ? { position: 'relative' as const }
            : {}),
      }}
    >
      {/* Title Bar */}
      <div
        className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex justify-between items-center shrink-0 select-none md:cursor-move touch-none"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => setMaximized(m => !m)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm" aria-hidden="true">{icon}</span>
          <h2 className="font-bold text-xs md:text-sm tracking-wide truncate">{title}</h2>
        </div>
        {/* Window Controls */}
        <div className="flex gap-1 shrink-0 ml-2">
          {registered ? (
            <button
              aria-label={`Minimize ${title}`}
              onClick={() => desktop!.minimize(windowId!)}
              className={`${CONTROL_BTN} flex`}
            >
              _
            </button>
          ) : (
            <button aria-hidden="true" tabIndex={-1} className={`${CONTROL_BTN} flex`}>
              _
            </button>
          )}
          <button
            aria-label={maximized ? `Restore ${title}` : `Maximize ${title}`}
            onClick={() => setMaximized(m => !m)}
            className={`${CONTROL_BTN} hidden md:flex`}
          >
            □
          </button>
          <button
            aria-label={`Close ${title}`}
            onClick={onClose ?? (() => window.history.back())}
            className={`${CONTROL_BTN} flex hover:bg-red-400`}
          >
            X
          </button>
        </div>
      </div>
      {/* Content Area */}
      <div className={`flex-1 flex flex-col min-h-0 ${bodyClassName}`}>{children}</div>
    </section>
  );
};
