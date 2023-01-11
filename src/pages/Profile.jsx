import {
  ArrowPathRoundedSquareIcon,
  ArrowRightOnRectangleIcon,
  CheckIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Header from '../components/reusable/Header';
import { db, firebaseApp } from '../firebase.config';
import userLogo from './../assets/images/user-icon.png';

function Profile() {
  const auth = getAuth(firebaseApp);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [changeDetails, setChangeDetails] = useState(false);

  const { name, email } = formData;

  const onLogout = () => {
    auth
      .signOut()
      .then(function () {
        toast.success('Farewell');
      })
      .catch(function (error) {
        toast.success('Farewell');
      });

    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error('Update profile failed');
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="min-h-full">
      <Navbar />
      <Header title="Profile" />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg border-4 border-dashed border-gray-200 flex flex-col sm:flex-col md:flex-row lg:flex-row">
              <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 p-3 sm:p-3 md:p-4 lg:p-4">
                <div className="flex justify-between mb-4">
                  <img
                    className="h-24 w-24 rounded-full drop-shadow-xl"
                    src={userLogo}
                    alt="User logo"
                  />

                  <div className="flex">
                    {changeDetails ? (
                      <button
                        onClick={() => {
                          onSubmit();
                          setChangeDetails((prevState) => !prevState);
                        }}
                        className="h-12 w-12 mr-2 group drop-shadow-md relative flex justify-center rounded-full border border-transparent bg-green-500 py-3 px-3 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
                      >
                        <CheckIcon
                          className="w-full text-indigo-100"
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onSubmit();
                          setChangeDetails((prevState) => !prevState);
                        }}
                        className="h-12 w-12 mr-2 group drop-shadow-md relative flex justify-center rounded-full border border-transparent bg-blue-500 py-3 px-3 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
                      >
                        <ArrowPathRoundedSquareIcon
                          className="w-full"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                    <button
                      onClick={onLogout}
                      className="h-12 w-12 group drop-shadow-md relative flex justify-center rounded-full border border-transparent bg-indigo-600 py-3 px-3 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
                    >
                      <ArrowRightOnRectangleIcon
                        className="w-full"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <form className="space-y-6">
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="mb-2">
                      <label
                        htmlFor="name"
                        className="block text-sm text-gray-500 font-medium"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        disabled={!changeDetails}
                        className={
                          'relative block w-full appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ' +
                          (!changeDetails
                            ? 'cursor-not-allowed'
                            : 'cursor-text')
                        }
                        placeholder="Name"
                        value={name}
                        onChange={onChange}
                      />
                      <div className="mt-2">
                        <label
                          htmlFor="email"
                          className="block text-sm text-gray-500 font-medium"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="text"
                          autoComplete="email"
                          disabled={true}
                          className={
                            'relative block w-full appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm cursor-not-allowed'
                          }
                          placeholder="Email"
                          value={email}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="w-full relative p-3 sm:p-3 md:p-4 lg:p-4">
                <div className="absolute top-0 right-1 p-3 sm:p-3 md:p-4 lg:p-4">
                  <Link
                    to={'/create-listing'}
                    className="h-12 w-12 group drop-shadow-md relative flex justify-center rounded-full border border-transparent bg-green-500 py-3 px-3 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
                  >
                    <PlusCircleIcon className="w-full" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
