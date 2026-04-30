import { Outlet } from 'react-router';
// Adjust this path if your components folder is located elsewhere!
import MandelbrotBackground from './components/MandelbrotBackground'; 

export function RootLayout() {
  return (
    <>
      {/* The background stays permanently fixed to the back */}
      <MandelbrotBackground />
      
      {/* The Outlet acts as a window where your current page is injected */}
      <div className="relative z-10">
        <Outlet /> 
      </div>
    </>
  );
}