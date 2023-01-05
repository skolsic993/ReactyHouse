import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import React from 'react';

function Banner({ title }) {
  return (
    <div className="bg-red-600">
      <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex w-0 flex-1 items-center">
            <span className="flex rounded-lg bg-red-700 p-2">
              <ExclamationTriangleIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </span>
            <p className="ml-3 truncate font-medium text-white">
              <span>{title}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
