import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { useStore } from './hooks/useStore';
// Updated path to the components folder
import MandelbrotBackground from './components/MandelbrotBackground';

export function App() {
  const { state, store } = useStore();

  useEffect(() => {
    store.initializeAuth();
    // ... rest of your auth logic
  }, [store]);

  if (state.isLoading) {
    return <div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>;
  }

  return (
    // "Sandwich" Layering: Background at z-0, Content at z-10
    <div className="relative min-h-screen w-full bg-black">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MandelbrotBackground />
      </div>
      <div className="relative z-10 w-full min-h-screen">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}