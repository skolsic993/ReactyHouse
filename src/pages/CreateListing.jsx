import { CheckIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import { db, firebaseApp } from '../firebase.config';

function CreateListing() {
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: true,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth(firebaseApp);
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({
            ...formData,
            userRef: user.uid,
          });
        } else {
          navigate('/signin');
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onMutate = (e) => {
    let bool = null;

    if (e.target.value === 'true') {
      bool = true;
    }

    if (e.target.value === 'false') {
      bool = false;
    }

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: bool ?? e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error('Discounted price needs to be less than regular price');
      return;
    }

    if (images.length > 6) {
      toast.error('Max 6 images');

      return;
    }

    let geoLocation = {};
    let location;

    if (!geoLocationEnabled) {
      toast.info('Make sure GeoLocation from Google is enabled');
    } else {
      geoLocation.lat = latitude;
      geoLocation.long = longitude;
      location = address;
    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, 'images/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error('Images not uploaded');
      return;
    });

    const formDataCopy = {
      ...formData,
      imageUrls,
      geoLocation,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    delete formDataCopy.address;
    location && (formDataCopy.location = location);
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
    setLoading(false);
    toast.success('Listing saved');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-full">
      <Navbar />
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create Listing
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm">
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
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Name"
                  maxLength="32"
                  minLength="10"
                  value={name}
                  onChange={onMutate}
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="address"
                  className="block text-sm text-gray-500 font-medium"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Address"
                  maxLength="50"
                  minLength="10"
                  value={address}
                  onChange={onMutate}
                />
              </div>

              <div className="mb-2 flex items-center">
                <div className="flex flex-col">
                  <label className="block text-sm text-gray-500 font-medium">
                    Sale / Rent
                  </label>
                  <div className="flex">
                    <button
                      id="type"
                      type="button"
                      value={'sale'}
                      className={
                        'group mr-2 w-20 relative flex justify-evenly items-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2 ' +
                        (type === 'sale'
                          ? 'justify-evenly items-center bg-green-500 hover:bg-green-400'
                          : 'justify-center bg-indigo-600 hover:bg-indigo-500')
                      }
                      onClick={onMutate}
                    >
                      {type === 'sale' && (
                        <CheckIcon
                          className="h-4 w-4 text-white group-hover:text-white"
                          aria-hidden="true"
                        />
                      )}
                      Sale
                    </button>
                    <button
                      id="type"
                      type="button"
                      value={'rent'}
                      className={
                        'group mr-2 w-20 relative flex justify-evenly items-center rounded-md border border-transparent  py-2 px-2 text-sm font-medium text-white  focus:outline-none focus:ring-2 focus:ring-green-100 focus:ring-offset-2 ' +
                        (type === 'rent'
                          ? 'justify-evenly items-center bg-green-500 hover:bg-green-400'
                          : 'justify-center bg-indigo-600 hover:bg-indigo-500')
                      }
                      onClick={onMutate}
                    >
                      {type === 'rent' && (
                        <CheckIcon
                          className="h-4 w-4 text-white group-hover:text-white"
                          aria-hidden="true"
                        />
                      )}
                      Rent
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-2 flex">
                <div className="flex flex-col mr-2">
                  <label
                    htmlFor="bedrooms"
                    className="block text-sm text-gray-500 font-medium"
                  >
                    Bedrooms
                  </label>
                  <input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    required
                    className="relative block appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Bedrooms"
                    min="1"
                    max="20"
                    value={bedrooms}
                    onChange={onMutate}
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="bathrooms"
                    className="block text-sm text-gray-500 font-medium"
                  >
                    Bathrooms
                  </label>
                  <input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    required
                    className="relative block appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Bedrooms"
                    min="1"
                    max="20"
                    value={bathrooms}
                    onChange={onMutate}
                  />
                </div>
              </div>

              <div className="mb-2 flex">
                <div className="flex flex-col mr-2">
                  <label
                    htmlFor="bedrooms"
                    className="block text-sm text-gray-500 font-medium"
                  >
                    Parking
                  </label>
                  <div className="flex flex-row">
                    <button
                      id="parking"
                      type="button"
                      value={true}
                      className={
                        'group mr-2 w-20 relative flex justify-evenly items-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2 ' +
                        (parking
                          ? 'justify-evenly items-center bg-green-500 hover:bg-green-400'
                          : 'justify-center bg-indigo-600 hover:bg-indigo-500')
                      }
                      onClick={onMutate}
                    >
                      {parking && (
                        <CheckIcon
                          className="h-4 w-4 text-white group-hover:text-white"
                          aria-hidden="true"
                        />
                      )}
                      Yes
                    </button>
                    <button
                      id="parking"
                      type="button"
                      value={false}
                      className={
                        'group mr-2 w-20 relative flex justify-evenly items-center rounded-md border border-transparent  py-2 px-2 text-sm font-medium text-white  focus:outline-none focus:ring-2 focus:ring-green-100 focus:ring-offset-2 ' +
                        (!parking
                          ? 'justify-evenly items-center bg-green-500 hover:bg-green-400'
                          : 'justify-center bg-indigo-600 hover:bg-indigo-500')
                      }
                      onClick={onMutate}
                    >
                      {!parking && (
                        <CheckIcon
                          className="h-4 w-4 text-white group-hover:text-white"
                          aria-hidden="true"
                        />
                      )}
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-2 flex">
                <div className="flex flex-col mr-2">
                  <label
                    htmlFor="bedrooms"
                    className="block text-sm text-gray-500 font-medium"
                  >
                    Furnished
                  </label>
                  <div className="flex flex-row">
                    <button
                      id="furnished"
                      value={true}
                      type="button"
                      className={
                        'group mr-2 w-20 relative flex justify-evenly items-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2 ' +
                        (furnished
                          ? 'justify-evenly items-center bg-green-500 hover:bg-green-400'
                          : 'justify-center bg-indigo-600 hover:bg-indigo-500')
                      }
                      onClick={onMutate}
                    >
                      {furnished && (
                        <CheckIcon
                          className="h-4 w-4 text-white group-hover:text-white"
                          aria-hidden="true"
                        />
                      )}
                      Yes
                    </button>
                    <button
                      id="furnished"
                      value={false}
                      type="button"
                      className={
                        'group mr-2 w-20 relative flex justify-evenly items-center rounded-md border border-transparent  py-2 px-2 text-sm font-medium text-white  focus:outline-none focus:ring-2 focus:ring-green-100 focus:ring-offset-2 ' +
                        (!furnished
                          ? 'justify-evenly items-center bg-green-500 hover:bg-green-400'
                          : 'justify-center bg-indigo-600 hover:bg-indigo-500')
                      }
                      onClick={onMutate}
                    >
                      {!furnished && (
                        <CheckIcon
                          className="h-4 w-4 text-white group-hover:text-white"
                          aria-hidden="true"
                        />
                      )}
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-2 flex">
                <div className="flex flex-col mr-2">
                  <label
                    htmlFor="bedrooms"
                    className="block text-sm text-gray-500 font-medium"
                  >
                    Offer
                  </label>
                  <div className="flex flex-row">
                    <button
                      id="offer"
                      value={true}
                      type="button"
                      className={
                        'group mr-2 w-20 relative flex justify-evenly items-center rounded-md border border-transparent bg-indigo-600 py-2 px-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2 ' +
                        (offer
                          ? 'justify-evenly items-center bg-green-500 hover:bg-green-400'
                          : 'justify-center bg-indigo-600 hover:bg-indigo-500')
                      }
                      onClick={onMutate}
                    >
                      {offer && (
                        <CheckIcon
                          className="h-4 w-4 text-white group-hover:text-white"
                          aria-hidden="true"
                        />
                      )}
                      Yes
                    </button>
                    <button
                      id="offer"
                      value={false}
                      type="button"
                      className={
                        'group mr-2 w-20 relative flex justify-evenly items-center rounded-md border border-transparent  py-2 px-2 text-sm font-medium text-white  focus:outline-none focus:ring-2 focus:ring-green-100 focus:ring-offset-2 ' +
                        (!offer
                          ? 'justify-evenly items-center bg-green-500 hover:bg-green-400'
                          : 'justify-center bg-indigo-600 hover:bg-indigo-500')
                      }
                      onClick={onMutate}
                    >
                      {!offer && (
                        <CheckIcon
                          className="h-4 w-4 text-white group-hover:text-white"
                          aria-hidden="true"
                        />
                      )}
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-2 flex">
                <div className="flex flex-col mr-2">
                  <label
                    htmlFor="regular price"
                    className="block text-sm text-gray-500 font-medium"
                  >
                    Regular price
                  </label>
                  <div className="flex flex-row items-center">
                    <input
                      id="regularPrice"
                      name="regularPrice"
                      type="number"
                      required
                      className="relative block appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm mr-2"
                      placeholder="Bedrooms"
                      min="50"
                      max="750000"
                      value={regularPrice}
                      onChange={onMutate}
                    />
                    {type === 'rent' && (
                      <p className="block text-medium text-green-500 font-medium">
                        {' '}
                        $ / Month
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {offer && (
                <div className="mb-2 flex">
                  <div className="flex flex-col mr-2">
                    <label
                      htmlFor="discounted price"
                      className="block text-sm text-gray-500 font-medium"
                    >
                      Discounted price
                    </label>
                    <div className="flex flex-row items-center">
                      <input
                        id="discountedPrice"
                        name="discountedPrice"
                        type="number"
                        required
                        className="relative block appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm mr-2"
                        placeholder="discounted price"
                        min="50"
                        max="750000"
                        value={discountedPrice}
                        onChange={onMutate}
                      />
                    </div>
                  </div>
                </div>
              )}

              {geoLocationEnabled && (
                <div className="mb-2 flex">
                  <div className="flex flex-col mr-2">
                    <label
                      htmlFor="Latitude"
                      className="block text-sm text-gray-500 font-medium"
                    >
                      Latitude
                    </label>
                    <input
                      id="latitude"
                      name="latitude"
                      type="number"
                      required
                      className="relative block appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm mr-2"
                      placeholder="Latitude"
                      value={latitude}
                      onChange={onMutate}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="Longitude"
                      className="block text-sm text-gray-500 font-medium"
                    >
                      Longitude
                    </label>
                    <input
                      id="longitude"
                      name="longitude"
                      type="number"
                      required
                      className="relative block appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm mr-2"
                      placeholder="Longitude"
                      value={longitude}
                      onChange={onMutate}
                    />
                  </div>
                </div>
              )}

              <div className="mb-2 flex">
                <div className="flex flex-col">
                  <label
                    htmlFor="images"
                    className="block text-sm text-gray-500 font-medium"
                  >
                    Images
                  </label>
                  <div className="flex flex-row items-center">
                    <input
                      id="images"
                      name="images"
                      type="file"
                      required
                      className="block w-full text-sm text-indigo-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-indigo-400 focus:outline-none dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 px-3 py-2"
                      placeholder="images"
                      max="6"
                      accept=".jpg,.png,.jpeg"
                      multiple
                      onChange={onMutate}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-500"
                    aria-hidden="true"
                  />
                </span>
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateListing;
