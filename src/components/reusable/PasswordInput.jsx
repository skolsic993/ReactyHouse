import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react';

function PasswordInput({ htmlForPass, id, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <label
        htmlFor={htmlForPass}
        className="block text-sm text-gray-500 font-medium capitalize"
      >
        {htmlForPass}
      </label>
      <div className="relative flex">
        <input
          id={id}
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          className="relative block w-full appearance-none rounded-none rounded-b-md border rounded-t-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          placeholder="Password"
          value={value}
          onChange={onChange}
        />
        {showPassword ? (
          <EyeIcon
            className="h-5 w-5 text-indigo-500 group-hover:text-indigo-500 cursor-pointer absolute flex align-center right-3"
            aria-hidden="true"
            onClick={() => setShowPassword((prevState) => !prevState)}
          />
        ) : (
          <EyeSlashIcon
            className="h-5 w-5 text-indigo-500 group-hover:text-indigo-500 cursor-pointer absolute flex align-center right-3"
            aria-hidden="true"
            onClick={() => setShowPassword((prevState) => !prevState)}
          />
        )}
      </div>
    </>
  );
}

export default PasswordInput;
