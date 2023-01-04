import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { firebaseApp } from '../firebase.config';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp);

    onAuthStateChanged(auth, (user) => {
      user && setLoggedIn(true);

      setCheckingStatus(false);
    });
  });

  return { loggedIn, checkingStatus };
};
