import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const tools = [
  // Text Tools
  { name: 'Text Formatter', path: '/text-formatter', category: 'Text Tools' },
  { name: 'Text Analyzer', path: '/text-analyzer', category: 'Text Tools' },
  { name: 'Text Diff', path: '/text-diff', category: 'Text Tools' },
  { name: 'Text Encoder', path: '/text-encoder', category: 'Text Tools' },
  { name: 'Text Case Converter', path: '/text-case-converter', category: 'Text Tools' },
  { name: 'Text Extractor', path: '/text-extractor', category: 'Text Tools' },
  { name: 'Text Replacer', path: '/text-replacer', category: 'Text Tools' },
  { name: 'Text Sorter', path: '/text-sorter', category: 'Text Tools' },
  { name: 'Text Splitter', path: '/text-splitter', category: 'Text Tools' },
  { name: 'Text Merger', path: '/text-merger', category: 'Text Tools' },
  { name: 'Text Counter', path: '/text-counter', category: 'Text Tools' },
  { name: 'Text Validator', path: '/text-validator', category: 'Text Tools' },
  { name: 'Text Compressor', path: '/text-compressor', category: 'Text Tools' },
  { name: 'Text Translator', path: '/text-translator', category: 'Text Tools' },
  { name: 'Text Summarizer', path: '/text-summarizer', category: 'Text Tools' },
  { name: 'Text Generator', path: '/text-generator', category: 'Text Tools' },
  
  // Converters
  { name: 'Time Zone Converter', path: '/timezone-converter', category: 'Converters' },
  { name: 'Base Converter', path: '/base-converter', category: 'Converters' },
  { name: 'Currency Converter', path: '/currency-converter', category: 'Converters' },
  { name: 'Unit Converter', path: '/unit-converter', category: 'Converters' },
  
  // Generators
  { name: 'QR Code Generator', path: '/qr-code-generator', category: 'Generators' },
  { name: 'Password Generator', path: '/password-generator', category: 'Generators' },
  { name: 'Color Picker', path: '/color-picker', category: 'Generators' },
  
  // Calculators
  { name: 'Calculator', path: '/calculator', category: 'Calculators' },
  { name: 'Date Calculator', path: '/date-calculator', category: 'Calculators' },
  
  // Editors
  { name: 'Code Editor', path: '/code-editor', category: 'Editors' },
  { name: 'Image Editor', path: '/image-editor', category: 'Editors' },
  { name: 'Text Editor', path: '/text-editor', category: 'Editors' },
  { name: 'File Converter', path: '/file-converter', category: 'Editors' },
  
  // Visualization
  { name: 'Data Visualizer', path: '/data-visualizer', category: 'Visualization' }
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      const filteredResults = tools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Search Results
          </h1>
          <div className="mt-4 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className="block w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaSearch />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {tool.category}
                  </p>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No tools found matching "{query}"
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Enter a search term to find tools
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 