import { Outlet } from 'react-router';
import MandelbrotBackground from './components/MandelbrotBackground'; 

export function RootLayout() {
  return (
    // 1. The main wrapper is now explicitly black
    <div className="relative min-h-screen w-full bg-black text-white">
      
      {/* 2. The background is locked to layer z-0 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MandelbrotBackground />
      </div>
      
      {/* 3. The page content is locked to layer z-10 (on top) */}
      <div className="relative z-10 w-full h-full">
        <Outlet /> 
      </div>
      
    </div>
  );
}