import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
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
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
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
        console.log(element[0].data.imageUrls[currentIndex]);
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

  //320px 425px

  if (loading) {
    return <Spinner />;
  }

  return (
    listings && (
      <div
        style={{
          backgroundImage: `url(${element[0].data.imageUrls[currentIndex]})`,
        }}
        className={`w-full h-full h-[${mobileSize}] sm:h-[${desktopSize}] rounded-2xl bg-center bg-cover duration-700 ease-in-out`}
      >
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
    )
  );
}

export default Slider;
