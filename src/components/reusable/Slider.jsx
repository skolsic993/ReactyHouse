import {
  ArrowLongRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import Spinner from '../Spinner';

function Slider({ mobileSize, desktopSize, id }) {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [element, setElement] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(6));
      const qSnap = await getDocs(q);

      let listings = [];

      qSnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      if (id) {
        const element = listings.filter((listing) => {
          return listing.id === id;
        });

        setElement(element);
      }

      setListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, []);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? listings[0].data.imageUrls.length - 1
      : currentIndex - 1;

    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === listings[0].data.imageUrls.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;

    setCurrentIndex(newIndex);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${
          element
            ? element[0].data.imageUrls[currentIndex]
            : listings[currentIndex].data.imageUrls[0]
        })`,
      }}
      className={`w-full h-full h-[${mobileSize}] sm:h-[${desktopSize}] rounded-2xl bg-center bg-cover duration-700 ease-in-out relative cursor-pointer`}
    >
      {' '}
      {!element && (
        <div className="absolute bottom-2 left-2 p-4 bg-white rounded-2xl">
          <p className="text-medium font-medium text-gray-900">
            {listings[currentIndex].data.name}
          </p>
          <p className="text-sm font-medium text-green-500">
            $
            {listings[currentIndex].data.discountedPrice ??
              listings[currentIndex].data.regularPrice}{' '}
            {listings[currentIndex].data.type === 'rent' && '/ month'}
          </p>
        </div>
      )}
      {!id && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() =>
              navigate(
                `/category/${
                  element
                    ? listings[0].data.type
                    : listings[currentIndex].data.type
                }/${element ? listings[0].id : listings[currentIndex].id}`
              )
            }
            className="h-12 w-12 group drop-shadow-md relative flex justify-center rounded-full border border-transparent bg-white py-3 px-3 text-sm font-medium text-black hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            <ArrowLongRightIcon
              className="w-full"
              aria-hidden="true"
              color="black"
            />
          </button>
        </div>
      )}
      <div
        className="w-10 absolute top-1/2 left-7 rounded-full p-1 bg-black/30 text-white cursor-pointer"
        onClick={prevSlide}
      >
        <ChevronLeftIcon />
      </div>
      <div
        className="w-10 absolute top-1/2 right-7 rounded-full p-1 bg-black/30 text-white cursor-pointer"
        onClick={nextSlide}
      >
        <ChevronRightIcon />
      </div>
    </div>
  );
}

export default Slider;
