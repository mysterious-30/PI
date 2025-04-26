import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - ToolsHub</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              404 - Page Not Found
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <Link
              to="/"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <HomeIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              Go back home
            </Link>
            <div className="text-sm">
              <p className="text-gray-500 dark:text-gray-400">
                Or try one of these options:
              </p>
              <div className="mt-2 space-x-4">
                <Link
                  to="/tools"
                  className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Browse Tools
                </Link>
                <Link
                  to="/categories"
                  className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View Categories
                </Link>
                <Link
                  to="/search"
                  className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound; 