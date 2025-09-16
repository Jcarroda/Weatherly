import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface GlobalSearchState {
  searchCity: string | null;
  searchCountry: string | null;
  triggerSearch: boolean;
}

interface GlobalSearchActions {
  setGlobalSearch: (city: string, country?: string) => void;
  clearGlobalSearch: () => void;
}

type GlobalSearchContextType = GlobalSearchState & GlobalSearchActions;

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

interface GlobalSearchProviderProps {
  children: ReactNode;
}

export const GlobalSearchProvider: React.FC<GlobalSearchProviderProps> = ({ children }) => {
  const [searchCity, setSearchCity] = useState<string | null>(null);
  const [searchCountry, setSearchCountry] = useState<string | null>(null);
  const [triggerSearch, setTriggerSearch] = useState(false);

  const setGlobalSearch = useCallback((city: string, country?: string) => {
    console.log('🌍 GlobalSearchProvider: Setting global search:', { city, country });
    setSearchCity(city);
    setSearchCountry(country || null);
    setTriggerSearch(true);
    
    // Reset trigger after a short delay
    setTimeout(() => {
      setTriggerSearch(false);
    }, 100);
  }, []);

  const clearGlobalSearch = useCallback(() => {
    console.log('🌍 GlobalSearchProvider: Clearing global search');
    setSearchCity(null);
    setSearchCountry(null);
    setTriggerSearch(false);
  }, []);

  const value: GlobalSearchContextType = {
    searchCity,
    searchCountry,
    triggerSearch,
    setGlobalSearch,
    clearGlobalSearch,
  };

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
    </GlobalSearchContext.Provider>
  );
};

export const useGlobalSearch = (): GlobalSearchContextType => {
  const context = useContext(GlobalSearchContext);
  if (context === undefined) {
    throw new Error('useGlobalSearch must be used within a GlobalSearchProvider');
  }
  return context;
};
