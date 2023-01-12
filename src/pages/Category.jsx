import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import Navbar from '../components/Navbar';
import Banner from '../components/reusable/Banner';
import Header from '../components/reusable/Header';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
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
  }, [params.categoryName]);

  return (
    <div className="min-h-full">
      <Navbar />
      <Header title="Category" />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg">
              <div className="sm:py-4 sm:px-0">
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
                  <Banner title="There are no items for the selected category" />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Category;
