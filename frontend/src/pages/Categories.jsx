import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchTools } from '../store/slices/toolsSlice';
import {
  DocumentTextIcon,
  CalculatorIcon,
  ChartBarIcon,
  CodeBracketIcon,
  PhotoIcon,
  GlobeAltIcon,
  DocumentDuplicateIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Categories = () => {
  const dispatch = useDispatch();
  const { items: tools, loading } = useSelector((state) => state.tools);

  useEffect(() => {
    dispatch(fetchTools());
  }, [dispatch]);

  const categories = [
    {
      name: 'Text Tools',
      icon: DocumentTextIcon,
      description: 'Tools for text manipulation, formatting, and analysis',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    {
      name: 'Math Tools',
      icon: CalculatorIcon,
      description: 'Mathematical calculators and converters',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    {
      name: 'Data Tools',
      icon: ChartBarIcon,
      description: 'Data analysis and visualization tools',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    },
    {
      name: 'Code Tools',
      icon: CodeBracketIcon,
      description: 'Programming and development utilities',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    },
    {
      name: 'Image Tools',
      icon: PhotoIcon,
      description: 'Image processing and manipulation tools',
      color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    },
    {
      name: 'Web Tools',
      icon: GlobeAltIcon,
      description: 'Web development and SEO tools',
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    },
    {
      name: 'File Tools',
      icon: DocumentDuplicateIcon,
      description: 'File conversion and management tools',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    },
    {
      name: 'System Tools',
      icon: CogIcon,
      description: 'System and utility tools',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  ];

  const getToolsByCategory = (categoryName) => {
    return tools.filter(tool => tool.category === categoryName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Categories - ToolsHub</title>
        <meta name="description" content="Browse tools by category" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Tool Categories
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            Browse our collection of tools organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const categoryTools = getToolsByCategory(category.name);
            
            return (
              <div
                key={category.name}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${category.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {categoryTools.length} tools
                      </span>
                      <Link
                        to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        View all →
                      </Link>
                    </div>
                    <div className="mt-4 space-y-2">
                      {categoryTools.slice(0, 3).map((tool) => (
                        <Link
                          key={tool._id}
                          to={`/tool/${tool.slug}`}
                          className="block p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {tool.name}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Categories; 