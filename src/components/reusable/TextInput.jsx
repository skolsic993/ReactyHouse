import React from 'react';

function TextInput({ htmlForName, id, value, onChange }) {
  return (
    <>
      <label
        htmlFor={htmlForName}
        className="block text-sm text-gray-500 font-medium capitalize"
      >
        {id}
      </label>
      <input
        id={id}
        name="name"
        type="text"
        required
        className="relative block w-full appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        placeholder={htmlForName}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInput;
