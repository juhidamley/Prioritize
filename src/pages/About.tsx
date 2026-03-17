import { useNavigate } from 'react-router';

const ABOUT_SVG_PATH = '/assets/aboutPage.svg';

// Make sure DESIGN_HEIGHT is the height of the actual SVG file!
const DESIGN_WIDTH = 1366;
const DESIGN_HEIGHT = 768; 
const HOME_BUTTON = { x: 104.8, y: 21.8, w: 152.1, h: 171.2 };

export function About() {
  const navigate = useNavigate();

  // Convert exact Canva pixels into strict percentages
  const leftPct = (HOME_BUTTON.x / DESIGN_WIDTH) * 100;
  const topPct = (HOME_BUTTON.y / DESIGN_HEIGHT) * 100;
  const widthPct = (HOME_BUTTON.w / DESIGN_WIDTH) * 100;
  const heightPct = (HOME_BUTTON.h / DESIGN_HEIGHT) * 100;

  return (
    // 1. OUTER SHELL: Takes up the whole screen and handles the vertical scrolling
    <div className="h-screen w-full bg-black overflow-y-auto overflow-x-hidden">
      
      {/* 2. RELATIVE WRAPPER: Stretches to the full width of the screen.
          Because it is relative, the absolute button inside calculates its position
          based on the stretched image, completely preventing aspect ratio drift. */}
      <div className="relative w-full h-fit">
        
        {/* The background SVG taking up the whole screen width */}
        <img
          src={ABOUT_SVG_PATH}
          alt="About"
          className="w-full h-auto block"
        />

        {/* 3. HOME BUTTON: Now absolutely positioned *to the image*, so it scrolls with it */}
        <button
          onClick={() => navigate('/')}
          aria-label="Go to Home"
          className="absolute z-50 group"
          style={{
            left: `${leftPct}%`,
            top: `${topPct}%`,
            width: `${widthPct}%`,
            height: `${heightPct}%`,
          }}
        >
          <img
            src="/assets/home.svg"
            alt="Home"
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
          />
        </button>
      </div>

    </div>
  );
}