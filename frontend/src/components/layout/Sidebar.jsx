import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { Menu, Transition } from '@headlessui/react';
import {
  HomeIcon,
  DocumentTextIcon,
  PhotographIcon,
  ChartBarIcon,
  CalculatorIcon,
  CodeIcon,
  GlobeAltIcon,
  XIcon,
  ChevronRightIcon
} from '@heroicons/react/outline';

const categories = [
  {
    name: 'Text Utilities',
    icon: DocumentTextIcon,
    tools: [
      { name: 'Word Counter', slug: 'word-counter' },
      { name: 'Text Case Converter', slug: 'text-case-converter' },
      { name: 'Text Reverser', slug: 'text-reverser' },
      { name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum' }
    ]
  },
  {
    name: 'Image Tools',
    icon: PhotographIcon,
    tools: [
      { name: 'Image Resizer', slug: 'image-resizer' },
      { name: 'Image Compressor', slug: 'image-compressor' },
      { name: 'Image Converter', slug: 'image-converter' }
    ]
  },
  {
    name: 'SEO Tools',
    icon: ChartBarIcon,
    tools: [
      { name: 'Meta Tags Analyzer', slug: 'meta-tags-analyzer' },
      { name: 'Keyword Density', slug: 'keyword-density' },
      { name: 'Backlink Checker', slug: 'backlink-checker' }
    ]
  },
  {
    name: 'Calculators',
    icon: CalculatorIcon,
    tools: [
      { name: 'Percentage Calculator', slug: 'percentage-calculator' },
      { name: 'Age Calculator', slug: 'age-calculator' },
      { name: 'BMI Calculator', slug: 'bmi-calculator' }
    ]
  },
  {
    name: 'Coding Tools',
    icon: CodeIcon,
    tools: [
      { name: 'HTML Formatter', slug: 'html-formatter' },
      { name: 'JSON Validator', slug: 'json-validator' },
      { name: 'Base64 Encoder', slug: 'base64-encoder' }
    ]
  },
  {
    name: 'Web Tools',
    icon: GlobeAltIcon,
    tools: [
      { name: 'URL Encoder', slug: 'url-encoder' },
      { name: 'IP Lookup', slug: 'ip-lookup' },
      { name: 'Website Speed Test', slug: 'website-speed-test' }
    ]
  }
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <div
      className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
            ToolsHub
          </Link>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-4">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                location.pathname === '/'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              Home
            </Link>

            {categories.map((category) => (
              <Menu as="div" key={category.name} className="mt-4">
                {({ open }) => (
                  <>
                    <Menu.Button
                      className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                        open
                          ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-200'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <category.icon className="h-5 w-5 mr-3" />
                      {category.name}
                      <ChevronRightIcon
                        className={`${
                          open ? 'transform rotate-90' : ''
                        } ml-auto h-5 w-5 text-gray-400`}
                      />
                    </Menu.Button>
                    <Transition
                      show={open}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="mt-2 space-y-1 px-4"
                      >
                        {category.tools.map((tool) => (
                          <Menu.Item key={tool.slug}>
                            {({ active }) => (
                              <Link
                                to={`/tool/${tool.slug}`}
                                className={`${
                                  active
                                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-200'
                                    : 'text-gray-700 dark:text-gray-200'
                                } block px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700`}
                              >
                                {tool.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            ))}
          </nav>
        </div>

        {isAuthenticated && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 