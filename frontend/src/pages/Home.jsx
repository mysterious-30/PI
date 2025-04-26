import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchTools } from '../store/slices/toolsSlice';
import {
  DocumentTextIcon,
  PhotographIcon,
  ChartBarIcon,
  CalculatorIcon,
  CodeIcon,
  GlobeAltIcon,
  StarIcon
} from '@heroicons/react/outline';

const categories = [
  {
    name: 'Text Utilities',
    icon: DocumentTextIcon,
    description: 'Tools for text manipulation and analysis',
    color: 'text-blue-500'
  },
  {
    name: 'Image Tools',
    icon: PhotographIcon,
    description: 'Image editing and conversion tools',
    color: 'text-green-500'
  },
  {
    name: 'SEO Tools',
    icon: ChartBarIcon,
    description: 'Search engine optimization tools',
    color: 'text-purple-500'
  },
  {
    name: 'Calculators',
    icon: CalculatorIcon,
    description: 'Various calculation tools',
    color: 'text-red-500'
  },
  {
    name: 'Coding Tools',
    icon: CodeIcon,
    description: 'Developer and programming tools',
    color: 'text-yellow-500'
  },
  {
    name: 'Web Tools',
    icon: GlobeAltIcon,
    description: 'Web development and analysis tools',
    color: 'text-indigo-500'
  }
];

const Home = () => {
  const dispatch = useDispatch();
  const { items: tools, loading } = useSelector((state) => state.tools);

  useEffect(() => {
    dispatch(fetchTools());
  }, [dispatch]);

  const featuredTools = tools
    .filter((tool) => tool.isFeatured)
    .slice(0, 6);

  return (
    <>
      <Helmet>
        <title>ToolsHub - Free Online Tools for Everyone</title>
        <meta
          name="description"
          content="Access 100+ free online tools for text editing, image processing, SEO, calculations, coding, and web development."
        />
      </Helmet>

      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Free Online Tools for Everyone
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Access 100+ powerful tools to make your work easier and faster
          </p>
        </section>

        {/* Featured Tools */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Featured Tools
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              featuredTools.map((tool) => (
                <Link
                  key={tool._id}
                  to={`/tool/${tool.slug}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center">
                    <tool.icon className={`h-6 w-6 ${tool.color} mr-2`} />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {tool.name}
                    </h3>
                    {tool.isFeatured && (
                      <StarIcon className="h-5 w-5 text-yellow-400 ml-auto" />
                    )}
                  </div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {tool.description}
                  </p>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tool Categories
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <category.icon className={`h-6 w-6 ${category.color} mr-2`} />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-indigo-50 dark:bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Need More Tools?
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            We're constantly adding new tools to help you work better and faster.
          </p>
          <div className="mt-6">
            <Link
              to="/tools"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse All Tools
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home; 