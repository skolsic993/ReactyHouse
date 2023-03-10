import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Link } from 'react-router-dom';
import BathIcon from '../assets/images/bathtub.png';
import BedIcon from '../assets/images/bed.png';

function ListingItem({ listing, id, onDelete, editItem }) {
  return (
    <div className="gap-y-4 lg:grid lg:grid-cols-1 lg:gap-y-8 relative">
      <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg mb-2">
        <Link to={`/category/${listing.type}/${id}`}>
          <div className="h-48 sm:h-64 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
            <img
              className="h-full w-full object-cover"
              src={listing.imageUrls[0]}
              alt={listing.name}
            />
          </div>
        </Link>
        <div className="relative">
          <h3 className="mt-4 text-medium text-gray-700 font-medium">
            {listing.name}
          </h3>
          <h3 className="w-60 text-sm text-gray-500 truncate">
            {listing.location}
          </h3>
          <div className="flex items-start flex-col sm:flex-row sm:items-row mt-1">
            <div className="flex flex-row mt-1 sm:mt-0">
              <img src={BedIcon} alt="Bed " className="w-4 h-4 ml-1 mr-3 " />
              <span className="text-sm text-gray-500 font-medium flex">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : '1 Bedroom'}{' '}
                ,
              </span>
            </div>
            <div className="flex flex-row">
              <img src={BathIcon} alt="Bed " className="w-4 h-4 ml-1 mr-3" />
              <span className="text-sm text-gray-500 font-medium flex">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : '1 Bathroom'}
              </span>
            </div>
          </div>
          <p className="mt-1 text-lg font-medium text-green-400">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            {listing.type === 'rent' && ' / Month'}
          </p>
          <div className="w-full absolute bottom-12 sm:relative">
            {editItem && (
              <button
                onClick={() => {
                  editItem(id);
                }}
                className="w-10 h-10 mr-3 group drop-shadow-md absolute top-0 right-10 flex justify-center items-center rounded-full border border-transparent bg-blue-600 py-2 px-2 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
              >
                <PencilIcon className="w-full" aria-hidden="true" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(id);
                }}
                className="w-10 h-10 group drop-shadow-md absolute top-0 right-1 flex justify-center items-center rounded-full border border-transparent bg-red-600 py-2 px-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
              >
                <TrashIcon className="w-full" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingItem;
