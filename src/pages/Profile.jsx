import {
  ArrowPathRoundedSquareIcon,
  ArrowRightOnRectangleIcon,
  CheckIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { getAuth, updateProfile } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import Navbar from '../components/Navbar';
import Header from '../components/reusable/Header';
import Spinner from '../components/Spinner';
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
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const qSnap = await getDocs(q);

      let listings = [];

      qSnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

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

  const editItem = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const onDelete = async (listingId) => {
    await deleteDoc(doc(db, 'listings', listingId));
    const updatedListings = listings.filter(
      (listing) => listing.id !== listingId
    );

    setListings(updatedListings);
    toast.success('Successfully removed');
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-full">
      <Navbar />
      <Header title="Profile" />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg flex flex-col sm:flex-col md:flex-row lg:flex-row">
              <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 p-3 sm:p-4 sm:pl-0">
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
                        className="h-10 w-10 sm:h-12 sm:w-12 mr-2 group drop-shadow-md relative flex justify-center rounded-full border border-transparent bg-green-500 py-2 px-2 sm:py-3 sm:px-3 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
                      >
                        <CheckIcon className="w-full" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onSubmit();
                          setChangeDetails((prevState) => !prevState);
                        }}
                        className="h-10 w-10 sm:h-12 sm:w-12 mr-2 group drop-shadow-md relative flex justify-center rounded-full border border-transparent bg-blue-500 py-2 px-2 sm:py-3 sm:px-3 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
                      >
                        <ArrowPathRoundedSquareIcon
                          className="w-full"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                    <Link
                      to={'/create-listing'}
                      className="h-10 w-10 sm:h-12 sm:w-12 group drop-shadow-md relative flex justify-center rounded-full border border-transparent bg-green-500 py-2 px-2 sm:py-3 sm:px-3 text-sm font-medium text-white hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2 mr-2"
                    >
                      <PlusCircleIcon className="w-full" aria-hidden="true" />
                    </Link>
                    <button
                      onClick={onLogout}
                      className="h-10 w-10 sm:h-12 sm:w-12 group drop-shadow-md relative flex justify-center rounded-full border border-transparent bg-indigo-600 py-2 px-2 sm:py-3 sm:px-3 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
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
                <div>
                  <ul>
                    <li>
                      <div className="mx-auto max-w-2xl lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8">
                        {listings &&
                          listings.map((listing) => (
                            <ListingItem
                              listing={listing.data}
                              id={listing.id}
                              key={listing.id}
                              editItem={() => editItem(listing.id)}
                              onDelete={() => onDelete(listing.id)}
                            />
                          ))}
                      </div>
                    </li>
                  </ul>
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
