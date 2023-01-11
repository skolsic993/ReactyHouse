import {
  ChatBubbleBottomCenterIcon,
  ShareIcon,
} from '@heroicons/react/20/solid';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'swiper/swiper-bundle.css';
import Navbar from '../components/Navbar';
import Header from '../components/reusable/Header';
import Slider from '../components/reusable/Slider';
import Spinner from '../components/Spinner';
import { db, firebaseApp } from '../firebase.config';

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  const onClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied');
  };

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? listing.imageUrls.length - 1
      : currentIndex - 1;

    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === listing.imageUrls.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;

    setCurrentIndex(newIndex);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-full">
      <Navbar />
      <Header title={listing.name} />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg border-4 border-dashed border-gray-200 flex flex-col sm:flex-col md:flex-row lg:flex-row relative">
              <div className="absolute top-0 right-1 p-3 sm:p-3 md:p-4 lg:p-4">
                <button
                  onClick={onClick}
                  className="h-12 w-12 group drop-shadow-md relative flex justify-center rounded-full border border-transparent bg-blue-500 py-3 px-3 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                >
                  <ShareIcon className="w-full" aria-hidden="true" />
                </button>
              </div>
              {auth.currentUser?.uid !== listing.userRef && (
                <div className="absolute top-0 right-14 p-3 sm:p-3 md:p-4 lg:p-4">
                  <Link
                    to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                    className="h-12 w-12 group drop-shadow-md relative flex justify-center rounded-full border border-transparent bg-blue-500 py-3 px-3 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  >
                    <ChatBubbleBottomCenterIcon
                      className="w-full"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              )}
              <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 p-3 sm:p-4 relative">
                <Slider
                  mobileSize={'320px'}
                  desktopSize={'425px'}
                  id={params.listingId}
                />
              </div>

              <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 p-3 sm:p-4">
                <div>
                  <h2 className="text-medium font-medium text-gray-700">
                    Address
                  </h2>

                  <div className="mt-1">
                    <p className="text-medium text-gray-600">
                      {listing.location}
                    </p>
                  </div>
                </div>
                <div className="mt-2 w-1/2 flex flex-col justify-start sm:flex-row sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <h2 className="text-medium font-medium text-gray-700">
                      Bedrooms
                    </h2>

                    <div className="mt-1">
                      <p className="text-medium text-gray-600">
                        {listing.bedrooms > 1
                          ? `${listing.bedrooms} Bedrooms`
                          : '1 Bedroom'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-medium font-medium text-gray-700">
                      Bathrooms
                    </h2>

                    <div className="mt-1">
                      <p className="text-medium text-gray-600">
                        {listing.bathrooms > 1
                          ? `${listing.bathrooms} Bathrooms`
                          : '1 Bathroom'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-2 w-1/2 flex flex-col justify-start sm:flex-row sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <h2 className="text-medium font-medium text-gray-700">
                      Furnished
                    </h2>

                    <div className="mt-1">
                      <p className="text-medium text-gray-600">
                        {listing.furnished ? 'Furnished' : 'Unfurnished'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-medium font-medium text-gray-700">
                      Parking Spot
                    </h2>

                    <div className="mt-1">
                      <p className="text-medium text-gray-600">
                        {listing.parking ? 'Available' : 'Disable'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-row">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-100">
                    For {listing.type === 'rent' ? 'rent' : 'sale'}
                  </span>
                  {listing.offer && (
                    <span className="bg-green-100 text-green-600 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-500 dark:text-green-100">
                      ${listing.regularPrice - listing.discountedPrice} discount
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <MapContainer
                    style={{ height: '200px', width: '100%' }}
                    center={[listing.latitude, listing.longitude]}
                    zoom={13}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                    />
                    <Marker position={[listing.latitude, listing.longitude]}>
                      <Popup>{listing.location}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Listing;
