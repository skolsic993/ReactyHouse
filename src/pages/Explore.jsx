import React from 'react';
import SecondHouse from '../assets/images/condo/fift.jpg';
import FourthHouse from '../assets/images/condo/first.jpg';
import FirstHouse from '../assets/images/condo/four.jpg';
import ThirdHouse from '../assets/images/condo/second.jpg';
import Navbar from '../components/Navbar';
import Categories from '../components/reusable/Categories';
import Header from '../components/reusable/Header';
import Slider from '../components/reusable/Slider';

function Explore() {
  return (
    <div className="min-h-full">
      <Navbar />
      <Header title="Explore" />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-1 py-6 sm:px-0">
            <div className="rounded-lg p-1 flex flex-col sm:flex-col md:flex-row lg:flex-row">
              <div className="w-full sm:h-[436px] sm:w-full md:w-1/2 lg:w-1/2 p-3 sm:p-4 sm:pl-0 relative">
                <h2 className="mb-4 text-medium font-medium text-gray-900">
                  Recommended
                </h2>
                <Slider mobileSize={'320px'} desktopSize={'436px'} />
              </div>
              <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 p-3 sm:p-4 sm:pr-0">
                <h2 className="mb-4 text-medium font-medium text-gray-900">
                  Categories
                </h2>
                <div className=" lg:grid lg:grid-cols-2 lg:gap-y-8 gap-3">
                  <Categories
                    link={'/category/rent'}
                    image={FirstHouse}
                    title={'Places for rent'}
                  />
                  <Categories
                    link={'/category/sale'}
                    image={SecondHouse}
                    title={'Places for sale'}
                  />
                </div>
                <div className="w-full sm:w-full mt-3 sm:mt-1">
                  <h2 className="mb-4 text-medium font-medium text-gray-900">
                    Featured
                  </h2>
                  <div className=" lg:grid lg:grid-cols-2 lg:gap-y-8 gap-3">
                    <Categories
                      link={'/offers'}
                      image={ThirdHouse}
                      title={'Current offers'}
                    />
                    <Categories
                      link={'/create-listing'}
                      image={FourthHouse}
                      title={'List your real estate'}
                    />
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
