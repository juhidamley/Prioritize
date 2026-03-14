import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useStore } from './hooks/useStore';

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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Removed the "if (!state.user) return <Login />" block entirely
  return <RouterProvider router={router} />;
}