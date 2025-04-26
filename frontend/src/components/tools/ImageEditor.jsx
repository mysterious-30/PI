import React, { useState, useRef } from 'react';
import { PhotoIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ImageEditor = ({ onProcess, processing = false }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcess = () => {
    if (onProcess && image) {
      onProcess(image);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            <PhotoIcon className="h-5 w-5 mr-2" />
            Upload Image
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            disabled={!image}
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Clear
          </button>
        </div>
        <button
          onClick={handleProcess}
          disabled={!image || processing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              Processing...
            </>
          ) : (
            'Process'
          )}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-96 mx-auto rounded-lg"
            />
            <div className="absolute bottom-2 right-2">
              <button
                onClick={handleClear}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <TrashIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Drag and drop an image here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Supports JPG, PNG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>

      {image && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>File: {image.name}</p>
          <p>Size: {(image.size / 1024 / 1024).toFixed(2)} MB</p>
          <p>Type: {image.type}</p>
        </div>
      )}
    </div>
  );
};

export default ImageEditor; 