import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = useCallback(() => setLoadingCount((c) => c + 1), []);
  const stopLoading = useCallback(() => setLoadingCount((c) => Math.max(0, c - 1)), []);

  const withLoading = useCallback(
    async (promiseOrFn) => {
      startLoading();
      try {
        const result =
          typeof promiseOrFn === 'function' ? await promiseOrFn() : await promiseOrFn;
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  const isLoading = loadingCount > 0;

  const value = useMemo(
    () => ({ isLoading, loadingCount, startLoading, stopLoading, withLoading }),
    [isLoading, loadingCount, startLoading, stopLoading, withLoading]
  );

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error('useGlobal precisa estar dentro de <GlobalProvider>');
  return ctx;
};

export default GlobalContext;