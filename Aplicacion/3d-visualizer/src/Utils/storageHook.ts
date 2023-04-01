import { useEffect, useState } from 'react';
import { defaultStorage } from '../Defaults/defaultStorage';

export const useLocalStorage = (key: string) => {
  const [storedValue, setStoredValue] = useState(() => {
    // localStorage.clear();
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultStorage;
    } catch (err) {
      console.error(err);
      window.dispatchEvent(new Event('storage'));
      return defaultStorage;
    }
  });

  const setValue = (value: EquationData) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   window.dispatchEvent(new Event("storage"));
  // }, [storedValue]);

  useEffect(() => {
    const listenStorageChange = () => {
      setStoredValue(() => {
        const value = localStorage.getItem(key);
        if (value !== null) {
          return JSON.parse(value) as EquationData;
        }

        localStorage.setItem(key, JSON.stringify(defaultStorage));
        window.dispatchEvent(new Event('storage'));
        return defaultStorage;
      });
    };
    window.addEventListener('storage', listenStorageChange);
    return () => window.removeEventListener('storage', listenStorageChange);
  }, []);

  return [storedValue, setValue];
};

export default useLocalStorage;
