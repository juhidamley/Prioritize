import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useStore } from './hooks/useStore';
import MandelbrotBackground from './MandelbrotBackground'; // <-- Import the background

export function App() {
  const { state, store } = useStore();

  useEffect(() => {
    store.initializeAuth();

    let cleanupRealtime: (() => void) | undefined;
    
    const unsubscribe = store.subscribe(() => {
      const currentState = store.getState();
      
      if (currentState.user && !cleanupRealtime) {
        cleanupRealtime = store.subscribeToRealtime();
      } else if (!currentState.user && cleanupRealtime) {
        cleanupRealtime();
        cleanupRealtime = undefined;
      }
    });

    return () => {
      unsubscribe();
      if (cleanupRealtime) cleanupRealtime();
    };
  }, [store]);

  if (state.isLoading) {
    return (
      <>
        <MandelbrotBackground /> {/* Optional: show background while loading */}
        <div className="flex items-center justify-center h-screen text-white relative z-10 font-mono text-xl tracking-widest">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      {/* Global Background stays completely fixed behind everything */}
      <MandelbrotBackground />
      
      {/* Router handles all your page content on top */}
      <RouterProvider router={router} />
    </>
  );
}