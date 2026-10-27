import { useGlobal } from '../contexts/GlobalContext';

export const useLoading = () => {
  const { isLoading, loadingCount, startLoading, stopLoading, withLoading } = useGlobal();
  return { isLoading, loadingCount, startLoading, stopLoading, withLoading };
};

export default useLoading;