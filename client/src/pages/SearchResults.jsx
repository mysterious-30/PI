import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { searchTools } from '../store/slices/toolsSlice';
import { setError } from '../store/slices/uiSlice';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.tools);

  useEffect(() => {
    if (query) {
      dispatch(searchTools(query));
    }
  }, [dispatch, query]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Search Results - ToolsHub</title>
        <meta name="description" content={`Search results for "${query}"`} />
      </Helmet>

      <div className="space-y-6">
        {/* Search Header */}
        <div className="flex items-center space-x-4">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Search Results
          </h1>
        </div>

        {/* Search Query */}
        <p className="text-gray-500 dark:text-gray-400">
          Showing results for "{query}"
        </p>

        {/* Results */}
        {searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((tool) => (
              <Link
                key={tool._id}
                to={`/tool/${tool.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {tool.name}
                    </h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      {tool.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {tool.category}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    <span>{tool.type}</span>
                  </div>
                  <div className="flex items-center">
                    <TagIcon className="h-4 w-4 mr-1" />
                    <span>{tool.tags.join(', ')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No tools found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or browse our categories
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Tools
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults; 