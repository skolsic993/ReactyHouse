import React from 'react';
import { Link } from 'react-router-dom';
import FirstHouse from '../assets/images/condo/first.jpg';
import SecondHouse from '../assets/images/condo/second.jpg';
import Navbar from '../components/Navbar';
import Header from '../components/reusable/Header';
import Slider from '../components/reusable/Slider';

function Explore() {
  return (
    <div className="min-h-full">
      <Navbar />
      <Header title="Explore" />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg border-4 border-dashed border-gray-200 flex flex-col sm:flex-col md:flex-row lg:flex-row">
              <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 p-3 sm:p-4 relative">
                <h2 className="mb-4 text-medium font-medium text-gray-900">
                  Recommended
                </h2>
                <Slider mobileSize={'320px'} desktopSize={'425px'} />
              </div>
              <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 p-3 sm:p-4">
                <h2 className="mb-4 text-medium font-medium text-gray-900">
                  Categories
                </h2>
                <div className=" lg:grid lg:grid-cols-2 lg:gap-y-8 gap-3">
                  <div className="aspect-w-2 aspect-h-2 overflow-hidden rounded-lg shadow-[inset_0_-15px_10px_rgba(0,0,0,0.8)] cursor-pointer mb-2 relative">
                    <Link to="/category/rent">
                      <img
                        src={FirstHouse}
                        alt="House"
                        className="h-full w-full object-cover object-center"
                      />
                      <div className="absolute bottom-2 left-2 bg-white p-2 rounded-xl">
                        <p className="text-sm font-medium text-gray-900">
                          Places for rent
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="aspect-w-2 aspect-h-2 overflow-hidden rounded-lg shadow-[inset_0_-15px_10px_rgba(0,0,0,0.8)] cursor-pointer mb-2 relative">
                    <Link to="/category/sale">
                      <img
                        src={SecondHouse}
                        alt="House"
                        className="h-full w-full object-cover object-center shadow-[inset_0_-15px_10px_rgba(0,0,0,0.8)]"
                      />
                      <div className="absolute bottom-2 left-2 bg-white p-2 rounded-xl">
                        <p className="text-sm font-medium text-gray-900">
                          Places for sale
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="w-full sm:w-full mt-1">
                  <h2 className="mb-4 text-medium font-medium text-gray-900">
                    Featured
                  </h2>
                  <div className=" lg:grid lg:grid-cols-2 lg:gap-y-8 gap-3">
                    <div className="aspect-w-2 aspect-h-2 overflow-hidden rounded-lg shadow-[inset_0_-15px_10px_rgba(0,0,0,0.8)] cursor-pointer mb-2 relative">
                      <Link to="/offers">
                        <img
                          src={FirstHouse}
                          alt="House"
                          className="h-full w-full object-cover object-center"
                        />
                        <div className="absolute bottom-2 left-2 bg-white p-2 rounded-xl">
                          <p className="text-sm font-medium text-gray-900">
                            Current offers
                          </p>
                        </div>
                      </Link>
                    </div>
                    <div className="aspect-w-2 aspect-h-2 overflow-hidden rounded-lg shadow-[inset_0_-15px_10px_rgba(0,0,0,0.8)] cursor-pointer mb-2 relative">
                      <Link to="/create-listing">
                        <img
                          src={SecondHouse}
                          alt="House"
                          className="h-full w-full object-cover object-center shadow-[inset_0_-15px_10px_rgba(0,0,0,0.8)]"
                        />
                        <div className="absolute bottom-2 left-2 bg-white p-2 rounded-xl">
                          <p className="text-sm font-medium text-gray-900">
                            List your real estate
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Explore;
