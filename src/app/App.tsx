import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { useStore } from './hooks/useStore';
// Import from the components folder
import MandelbrotBackground from './components/MandelbrotBackground'; 

export function App() {
  const { state, store } = useStore();

  useEffect(() => {
    store.initializeAuth();
    // ... rest of your auth logic
  }, [store]);

  if (state.isLoading) {
    return <div className="flex items-center justify-center h-screen bg-black text-white font-mono">Loading...</div>;
  }

  return (
    // This container forces the stacking order
    <div className="relative min-h-screen w-full bg-black">
      
      {/* LAYER 0: The Background (Stays at the bottom) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MandelbrotBackground />
      </div>

      {/* LAYER 10: Your Actual Site (Stays on top) */}
      <div className="relative z-10 w-full min-h-screen">
        <RouterProvider router={router} />
      </div>

    </div>
  );
}