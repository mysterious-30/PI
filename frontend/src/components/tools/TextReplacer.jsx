import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';

const TextReplacer = ({ 
  onProcess, 
  processing = false,
  initialValue = '',
  showHistory = true
}) => {
  const [value, setValue] = useState(initialValue);
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [options, setOptions] = useState({
    caseSensitive: false,
    useRegex: false,
    global: true
  });

  useEffect(() => {
    if (value && find) {
      replaceText();
    } else {
      setResult(null);
    }
  }, [value, find, replace, options]);

  const handleClear = () => {
    setValue('');
    setFind('');
    setReplace('');
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
        find,
        replace,
        options,
        result
      });
    }
  };

  const replaceText = () => {
    try {
      setError(null);
      
      if (!value || !find) {
        setResult(null);
        return;
      }

      let searchPattern;
      if (options.useRegex) {
        try {
          searchPattern = new RegExp(find, options.caseSensitive ? 'g' : 'gi');
        } catch (err) {
          setError('Invalid regular expression pattern.');
          return;
        }
      } else {
        searchPattern = options.caseSensitive ? find : new RegExp(find, 'gi');
      }

      const replaced = value.replace(searchPattern, replace);
      setResult(replaced);

      if (showHistory) {
        const entry = {
          text: value.slice(0, 50) + (value.length > 50 ? '...' : ''),
          find,
          replace,
          options: { ...options },
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Error replacing text. Please check your input and options.');
      console.error('Replacement error:', err);
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
          <button
            onClick={handleProcess}
            disabled={processing || !value || !find}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Replacing...
              </>
            ) : (
              'Replace'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text to Replace In
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
              placeholder="Enter text to replace in"
              rows={6}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="find" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Find
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="find"
                value={find}
                onChange={(e) => setFind(e.target.value)}
                className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Text to find"
              />
            </div>
          </div>

          <div>
            <label htmlFor="replace" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Replace With
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowUturnLeftIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="replace"
                value={replace}
                onChange={(e) => setReplace(e.target.value)}
                className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Replacement text"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.caseSensitive}
              onChange={(e) => setOptions({ ...options, caseSensitive: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Case Sensitive</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.useRegex}
              onChange={(e) => setOptions({ ...options, useRegex: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Use Regular Expression</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.global}
              onChange={(e) => setOptions({ ...options, global: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Replace All</span>
          </label>
        </div>

        {result && (
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Replaced Text
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {value.length !== result.length ? 'Changes made' : 'No changes'}
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
            Recent Replacements
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
                  "{entry.find}" → "{entry.replace}" • {entry.date.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.options.caseSensitive && 'Case Sensitive • '}
                  {entry.options.useRegex && 'Regex • '}
                  {entry.options.global && 'Global'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextReplacer; 