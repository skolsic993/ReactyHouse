import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import Navbar from '../components/Navbar';
import Banner from '../components/reusable/Banner';
import Header from '../components/reusable/Header';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc', limit(9))
        );

        const querySnap = await getDocs(q);

        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch data');
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-full">
      <Navbar />
      <Header title="Offers" />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg">
              <div className="py-4 sm:py-6">
                <div className="">
                  <nav aria-label="Breadcrumb">
                    <ul className="mx-auto flex max-w-2xl items-center space-x-2 lg:max-w-7xl">
                      <li className=" text-sm font-medium text-gray-900">
                        <Link
                          aria-current="page"
                          className=" text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          {params.categoryName}
                        </Link>
                      </li>
                    </ul>
                  </nav>

                  {loading ? (
                    <Spinner />
                  ) : listings && listings.length > 0 ? (
                    <>
                      <main>
                        <ul>
                          <li>
                            <div className="mx-auto max-w-2xl lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8">
                              {listings.map((listing) => (
                                <ListingItem
                                  listing={listing.data}
                                  id={listing.id}
                                  key={listing.id}
                                  onDelete={false}
                                />
                              ))}
                            </div>
                          </li>
                        </ul>
                      </main>
                    </>
                  ) : (
                    <Banner title="There are no current offers" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Offers;
