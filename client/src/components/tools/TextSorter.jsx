import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

const TextSorter = ({ 
  onProcess, 
  processing = false,
  initialValue = '',
  showHistory = true
}) => {
  const [value, setValue] = useState(initialValue);
  const [sortType, setSortType] = useState('alphabetical');
  const [sortOrder, setSortOrder] = useState('asc');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  const sortTypes = [
    { 
      value: 'alphabetical', 
      label: 'Alphabetical',
      description: 'Sort text alphabetically'
    },
    { 
      value: 'length', 
      label: 'By Length',
      description: 'Sort text by line length'
    },
    { 
      value: 'numeric', 
      label: 'Numeric',
      description: 'Sort text numerically'
    },
    { 
      value: 'reverse', 
      label: 'Reverse',
      description: 'Reverse the order of lines'
    },
    { 
      value: 'unique', 
      label: 'Unique',
      description: 'Remove duplicate lines'
    },
    { 
      value: 'shuffle', 
      label: 'Shuffle',
      description: 'Randomly shuffle lines'
    }
  ];

  useEffect(() => {
    if (value) {
      sortText();
    } else {
      setResult(null);
    }
  }, [value, sortType, sortOrder]);

  const handleClear = () => {
    setValue('');
    setResult(null);
    setError(null);
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy result:', err);
      }
    }
  };

  const handleProcess = () => {
    if (onProcess) {
      onProcess({
        value,
        sortType,
        sortOrder,
        result
      });
    }
  };

  const sortText = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult(null);
        return;
      }

      const lines = value.split('\n').filter(line => line.trim());
      let sorted;

      switch (sortType) {
        case 'alphabetical':
          sorted = lines.sort((a, b) => 
            sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
          );
          break;
        case 'length':
          sorted = lines.sort((a, b) => 
            sortOrder === 'asc' ? a.length - b.length : b.length - a.length
          );
          break;
        case 'numeric':
          sorted = lines.sort((a, b) => {
            const numA = parseFloat(a.replace(/[^0-9.-]+/g, ''));
            const numB = parseFloat(b.replace(/[^0-9.-]+/g, ''));
            return sortOrder === 'asc' ? numA - numB : numB - numA;
          });
          break;
        case 'reverse':
          sorted = [...lines].reverse();
          break;
        case 'unique':
          sorted = [...new Set(lines)];
          break;
        case 'shuffle':
          sorted = [...lines].sort(() => Math.random() - 0.5);
          break;
        default:
          sorted = lines;
      }

      setResult(sorted.join('\n'));

      if (showHistory) {
        const entry = {
          text: value.slice(0, 50) + (value.length > 50 ? '...' : ''),
          sortType,
          sortOrder,
          lineCount: lines.length,
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Error sorting text. Please check your input.');
      console.error('Sorting error:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClear}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Clear
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {sortTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {sortType !== 'reverse' && sortType !== 'unique' && sortType !== 'shuffle' && (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          )}
          <button
            onClick={handleProcess}
            disabled={processing || !value}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Sorting...
              </>
            ) : (
              'Sort'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text to Sort
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter text to sort (one item per line)"
              rows={6}
            />
          </div>
        </div>

        {result && (
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sorted Text
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {result.split('\n').length} lines
              </span>
            </div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DocumentDuplicateIcon className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="result"
                value={result}
                readOnly
                className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                rows={6}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ClipboardIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-md bg-red-50 dark:bg-red-900">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Sorts
          </h3>
          <div className="mt-2 space-y-2">
            {history.map((entry, index) => (
              <div
                key={index}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <div className="text-sm text-gray-900 dark:text-white">
                  {entry.text}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {sortTypes.find(type => type.value === entry.sortType)?.label} • {entry.lineCount} lines • {entry.date.toLocaleString()}
                </div>
                {entry.sortOrder && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextSorter; 