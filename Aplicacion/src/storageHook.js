import React, { useEffect, useState } from 'react'

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (err) {
        console.error(err);
        window.dispatchEvent(new Event("storage"));
        return initialValue;
      }
    });
  
    const setValue = value => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event("storage"));
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
              return JSON.parse(value);
            }
    
            localStorage.setItem(key, JSON.stringify(initialValue));
            window.dispatchEvent(new Event("storage"));
            return initialValue;
          });
        };
        window.addEventListener("storage", listenStorageChange);
        return () => window.removeEventListener("storage", listenStorageChange);
      }, []);
  
    return [storedValue, setValue];
  };
  
  export default useLocalStorage;