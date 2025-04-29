import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const StartupContext = createContext();

export function StartupProvider({ children }) {
  const { currentUser } = useAuth();
  const [startupData, setStartupData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'startups', currentUser.uid), (doc) => {
      if (doc.exists()) {
        setStartupData(doc.data());
      } else {
        setStartupData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const value = {
    startupData,
    loading
  };

  return (
    <StartupContext.Provider value={value}>
      {children}
    </StartupContext.Provider>
  );
}

export function useStartup() {
  return useContext(StartupContext);
}