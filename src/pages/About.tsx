import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';

const ABOUT_SVG_PATH = '/assets/aboutPage.svg';

const DESIGN_WIDTH = 1366;
const DESIGN_HEIGHT = 768;

// x/y: top-left corner of element in design-space px (1366x768)
// w/h: size in design-space px
const HOME_BUTTON = { x: 104.8, y: 81.8, w: 152.1, h: 171.2 };

export function About() {
  const navigate = useNavigate();

  const scaledX = (v: number) => `${(v / DESIGN_WIDTH) * 100}vw`;
  const scaledY = (v: number) => `${(v / DESIGN_HEIGHT) * 100}vh`;

  return (
    <>
      {/* Scrollable page content */}
      <div className="min-h-screen w-screen overflow-y-auto bg-black">
        <img
          src={ABOUT_SVG_PATH}
          alt="About"
          className="w-full h-auto block"
        />
      </div>

      {/* Home button — portalled to body so nothing can make it scroll */}
      {createPortal(
        <button
          onClick={() => navigate('/')}
          aria-label="Go to Home"
          className="fixed z-[9999] transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            left: scaledX(HOME_BUTTON.x),
            top: scaledY(HOME_BUTTON.y),
            width: scaledX(HOME_BUTTON.w),
            height: scaledY(HOME_BUTTON.h),
          }}
        >
          <img
            src="/assets/home.svg"
            alt="Home"
            className="w-full h-full object-contain"
          />
        </button>,
        document.body
      )}
    </>
  );
}
