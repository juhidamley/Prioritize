import { useNavigate } from 'react-router';

const DESIGN_WIDTH = 1366;
const DESIGN_HEIGHT = 768;
const SHOW_TAPES = false;

type PxValue = number | `${number}px`;

type NavItem = {
  label: string;
  icon: string;
  path: string;
  x: PxValue;
  y: PxValue;
  w: PxValue;
  h: PxValue;
};

type TapeItem = {
  src: string;
  alt: string;
  x: PxValue;
  y: PxValue;
  w: PxValue;
  h: PxValue;
  rotation?: number;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: '/assets/home.svg', path: '/', x: 313.6, y: 194.5, w: 152.1, h: 171.2 },
  { label: 'Links', icon: '/assets/links.svg', path: '/links', x: 316.1, y: 392.5, w: 141.8, h: 152.9 },
  { label: 'About', icon: '/assets/about.svg', path: '/about', x: 510, y: 199.6, w: 141.8, h: 159.5 },
  { label: 'Resume', icon: '/assets/resume.svg', path: '/resume', x: 511.8, y: 392.5, w: 141.8, h: 149.2 },
  { label: 'Contact', icon: '/assets/contact.svg', path: '/contact', x:  707.2, y: 233, w: 141.8, h: 126.1 },
  { label: 'Prioritize', icon: '/assets/prioritize.svg', path: '/prioritize', x: 707.2, y: 392.5, w: 141.8, h: 149.2 },
  { label: 'Projects', icon: '/assets/projects.svg', path: '/projects', x: 878.4, y: 195.3, w: 141.8, h: 163.8 },
  { label: 'Research', icon: '/assets/research.svg', path: '/research', x: 878.4, y: 392.5, w: 141.8, h: 149.2 },
];

const TAPE_ITEMS: TapeItem[] = [
  {
    src: '/assets/tape.png',
    alt: 'Tape',
    x: -517.3,
    y: -377.8,
    w: 2796.1,
    h: 963,
    rotation: -17.1,
  },
];

export function Home() {
  const navigate = useNavigate();

  const toPxNumber = (value: PxValue) =>
    typeof value === 'number' ? value : Number.parseFloat(value);

  const scaledX = (value: PxValue) => `${(toPxNumber(value) / DESIGN_WIDTH) * 100}vw`;
  const scaledY = (value: PxValue) => `${(toPxNumber(value) / DESIGN_HEIGHT) * 100}vh`;

  return (
    <div
      className="fixed inset-0 h-dvh w-screen bg-[#1a0b2e] bg-[url('/assets/landing.png')] bg-cover bg-center overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-600/10 to-transparent pointer-events-none" />

      {/* Absolute icon layout controlled by x/y/w/h on each item */}
      <div className="absolute inset-0 z-10">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (item.path === '/prioritize') {
                window.location.href = '/prioritize/'; 
              } else {
                navigate(item.path);
              }
            }}
            className="absolute flex flex-col items-center group transition-all duration-300 hover:scale-110 active:scale-95"
            style={{ left: scaledX(item.x), top: scaledY(item.y) }}
          >
            <div
              className="flex items-center justify-center mb-3"
              style={{ width: scaledX(item.w), height: scaledY(item.h) }}
            >
              <img 
                src={item.icon} 
                alt={item.label} 
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]" 
              />
            </div>
          </button>
        ))}
      </div>

      {/* Absolute tape layout controlled by x/y/w/h on each item */}
      {SHOW_TAPES && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {TAPE_ITEMS.map((item) => (
            <img
              key={`${item.src}-${item.x}-${item.y}`}
              src={item.src}
              alt={item.alt}
              className="absolute object-contain drop-shadow-2xl"
              style={{
                left: scaledX(item.x),
                top: scaledY(item.y),
                width: scaledX(item.w),
                height: scaledY(item.h),
                transformOrigin: 'top left',
                transform: `rotate(${item.rotation ?? 0}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}