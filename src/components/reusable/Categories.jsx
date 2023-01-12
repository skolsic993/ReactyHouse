import React from 'react';
import { Link } from 'react-router-dom';

function Categories({ link, image, title }) {
  return (
    <div className="aspect-w-2 aspect-h-2 overflow-hidden rounded-lg cursor-pointer mb-2 relative">
      <Link to={link}>
        <img
          src={image}
          alt="House"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute bottom-2 left-2 bg-white p-2 rounded-xl">
          <p className="text-sm font-medium text-gray-900">{title}</p>
        </div>
      </Link>
    </div>
  );
}

export default Categories;
