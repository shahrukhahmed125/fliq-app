import React, { createContext, useContext, useState } from 'react';
import { ROUTES } from '../lib/constants';

interface NavigationContextType {
  currentRoute: string;
  navigate: (route: string) => void;
  goBack: () => void;
  history: string[];
}

const NavigationContext = createContext<NavigationContextType>({
  currentRoute: ROUTES.HOME,
  navigate: () => {},
  goBack: () => {},
  history: [ROUTES.HOME],
});

export const NavigationProvider = ({
  children,
  initialRoute = ROUTES.HOME,
}: {
  children: React.ReactNode;
  initialRoute?: string;
}) => {
  const [history, setHistory] = useState<string[]>([initialRoute]);

  const currentRoute = history[history.length - 1] || initialRoute;

  const navigate = (route: string) => {
    setHistory((prev) => [...prev, route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider value={{ currentRoute, navigate, goBack, history }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
