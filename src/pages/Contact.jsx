import { ChatBubbleBottomCenterIcon } from '@heroicons/react/20/solid';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Header from '../components/reusable/Header';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';

function Contact() {
  const [message, setMessage] = useState('');
  const [landlord, setLandLord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const getLandLord = async () => {
      const docRef = doc(db, 'users', params.landlordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandLord(docSnap.data());
        setLoading(false);
      } else {
        toast.error('Could not get landlord data');
      }
    };

    getLandLord();
  }, [params.landlordId]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  if (loading) {
    <Spinner />;
  }

  return (
    <div className="min-h-full">
      <Navbar />
      <Header
        title={!landlord !== null ? `Contact ${landlord?.name}` : 'Contact'}
      />
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {!landlord !== null && (
          <div className="w-full max-w-md space-y-8">
            <form className="mt-8 space-y-6">
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div className="mb-2">
                  <label
                    htmlFor="message"
                    className="block text-sm text-gray-500 font-medium"
                  >
                    Message
                  </label>
                </div>
                <textarea
                  name="message"
                  rows="5"
                  cols="60"
                  id="message"
                  className="block p-2.5 w-full text-sm bg-blue-50 rounded-lg border focus:ring-blue-100 focus:border-blue-500 focus:outline-none focus-visible:border-gray-100 dark:placeholder-gray-100 dark:text-gray-700"
                  value={message}
                  onChange={onChange}
                >
                  {' '}
                </textarea>
              </div>
              <div>
                <a
                  href={`mailto:${landlord?.email}?Subject=${searchParams.get(
                    'listingName'
                  )}&body=${message}`}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <ChatBubbleBottomCenterIcon
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-500"
                      aria-hidden="true"
                    />
                  </span>
                  Send Message
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contact;
