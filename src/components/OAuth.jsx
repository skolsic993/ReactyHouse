import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db, firebaseApp } from '../firebase.config';
import googleIcon from './../assets/images/google.png';

function OAuth() {
  const navigate = useNavigate();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth(firebaseApp);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate('/');
    } catch (error) {
      toast.error('Could not authorize with Google!');
    }
  };

  return (
    <div>
      <button
        onClick={onGoogleClick}
        className="group relative flex justify-center rounded-full border border-transparent bg-white py-4 px-4 text-sm font-medium text-white drop-shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
      >
        <img
          src={googleIcon}
          className="h-5 w-5 text-indigo-500 group-hover:text-indigo-100"
          aria-hidden="true"
          alt="Google icon"
        />
      </button>
    </div>
  );
}

export default OAuth;
