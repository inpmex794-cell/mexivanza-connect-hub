import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';

/**
 * Hook for content that needs to update when language changes
 * Automatically triggers re-render when language switcher is used
 */
export const useReactiveContent = () => {
  const { language, t } = useLanguage();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleLanguageChange = () => {
      // Force component re-render when language changes
      forceUpdate({});
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  return { language, t };
};

/**
 * Hook for dynamic content that should refresh when language changes
 * Use this for content fetched from APIs or databases
 */
export const useLanguageAwareContent = function<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const { language } = useLanguage();
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction();
        setContent(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    // Listen for language changes
    const handleLanguageChange = () => {
      fetchContent();
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, [language, ...dependencies]);

  return { content, loading, error, refetch: () => fetchFunction() };
};