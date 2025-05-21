import { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type ViewStateContextType = {
  viewHistory: Record<string, string>;
  registerPath: (viewType: string, path: string) => void;
  getLastPath: (viewType: string) => string | null;
};

const ViewStateContext = createContext<ViewStateContextType | null>(null);

export const ViewStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewHistory, setViewHistory] = useState<Record<string, string>>({
    app: '/app/overview',
    dashboard: '/dashboard/overview',
  });

  const location = useLocation();

  // Track current paths automatically
  useEffect(() => {
    if (location.pathname.startsWith('/app')) {
      setViewHistory((prev) => ({
        ...prev,
        app: location.pathname + location.search + location.hash,
      }));
    } else if (location.pathname.startsWith('/dashboard')) {
      setViewHistory((prev) => ({
        ...prev,
        dashboard: location.pathname + location.search + location.hash,
      }));
    }
  }, [location]);

  // Method to manually register a path for a view type
  const registerPath = (viewType: string, path: string) => {
    setViewHistory((prev) => ({ ...prev, [viewType]: path }));
  };

  // Get the last known path for a view type
  const getLastPath = (viewType: string): string | null => {
    return viewHistory[viewType] || null;
  };

  return (
    <ViewStateContext.Provider value={{ viewHistory, registerPath, getLastPath }}>
      {children}
    </ViewStateContext.Provider>
  );
};

// Custom hook to use the view state context
// eslint-disable-next-line react-refresh/only-export-components
export const useViewState = () => {
  const context = useContext(ViewStateContext);
  if (!context) {
    throw new Error('useViewState must be used within a ViewStateProvider');
  }
  return context;
};
