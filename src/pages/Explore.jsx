import React from 'react';
import { Link } from 'react-router-dom';
import FirstHouse from '../assets/images/condo/first.jpg';
import SecondHouse from '../assets/images/condo/second.jpg';
import Navbar from '../components/Navbar';
import Header from '../components/reusable/Header';

function Explore() {
  return (
    <div className="min-h-full">
      <Navbar />
      <Header title="Explore" />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg border-4 border-dashed border-gray-200 flex flex-col sm:flex-col md:flex-row lg:flex-row">
              <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 p-3 sm:p-4">
                AAA
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
                      <p className="absolute bottom-2 left-2 text-white">
                        Places for rent
                      </p>
                    </Link>
                  </div>
                  <div className="aspect-w-2 aspect-h-2 overflow-hidden rounded-lg shadow-[inset_0_-15px_10px_rgba(0,0,0,0.8)] cursor-pointer mb-2 relative">
                    <Link to="/category/sale">
                      <img
                        src={SecondHouse}
                        alt="House"
                        className="h-full w-full object-cover object-center shadow-[inset_0_-15px_10px_rgba(0,0,0,0.8)]"
                      />
                      <p className=" absolute bottom-2 left-2 text-white">
                        Places for sale
                      </p>
                    </Link>
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
