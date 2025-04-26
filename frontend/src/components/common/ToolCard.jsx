import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/24/solid';

const ToolCard = ({ tool, onFavoriteToggle, isFavorite }) => {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Link
            to={`/tool/${tool.slug}`}
            className="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {tool.name}
          </Link>
          <button
            onClick={() => onFavoriteToggle(tool._id)}
            className="text-gray-400 hover:text-yellow-400 dark:hover:text-yellow-400"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <StarIconFilled className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {tool.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {tool.usageCount || 0} uses
            </span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            {tool.type}
          </span>
        </div>
        <div className="mt-4">
          <Link
            to={`/tool/${tool.slug}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try it now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToolCard; 