import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  ArrowLeftRightIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { diffLines, diffWords, diffChars } from 'diff';

const TextDiff = ({ 
  onProcess, 
  processing = false,
  initialValue1 = '',
  initialValue2 = '',
  showHistory = true
}) => {
  const [value1, setValue1] = useState(initialValue1);
  const [value2, setValue2] = useState(initialValue2);
  const [diffType, setDiffType] = useState('lines');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (value1 || value2) {
      generateDiff();
    } else {
      setResult(null);
    }
  }, [value1, value2, diffType]);

  const handleClear = () => {
    setValue1('');
    setValue2('');
    setResult(null);
    setError(null);
  };

  const handleSwap = () => {
    setValue1(value2);
    setValue2(value1);
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
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
        value1,
        value2,
        diffType,
        result
      });
    }
  };

  const generateDiff = () => {
    try {
      setError(null);
      
      if (!value1 && !value2) {
        setResult(null);
        return;
      }

      let diff;
      switch (diffType) {
        case 'lines':
          diff = diffLines(value1, value2);
          break;
        case 'words':
          diff = diffWords(value1, value2);
          break;
        case 'chars':
          diff = diffChars(value1, value2);
          break;
        default:
          diff = diffLines(value1, value2);
      }

      setResult(diff);

      if (showHistory) {
        const comparison = {
          text1: value1.slice(0, 50) + (value1.length > 50 ? '...' : ''),
          text2: value2.slice(0, 50) + (value2.length > 50 ? '...' : ''),
          type: diffType,
          date: new Date()
        };
        setHistory(prev => [comparison, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Invalid text comparison. Please check your input.');
      console.error('Diff error:', err);
    }
  };

  const renderDiff = () => {
    if (!result) return null;

    return (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-md border border-gray-300 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Original Text
            </h3>
            <div className="font-mono text-sm space-y-1">
              {result.map((part, index) => (
                part.removed && (
                  <div key={index} className="bg-red-100 dark:bg-red-900 p-1">
                    {part.value}
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="p-4 rounded-md border border-gray-300 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Modified Text
            </h3>
            <div className="font-mono text-sm space-y-1">
              {result.map((part, index) => (
                part.added && (
                  <div key={index} className="bg-green-100 dark:bg-green-900 p-1">
                    {part.value}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-md border border-gray-300 dark:border-gray-600">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Combined View
          </h3>
          <div className="font-mono text-sm space-y-1">
            {result.map((part, index) => {
              if (part.added) {
                return (
                  <div key={index} className="bg-green-100 dark:bg-green-900 p-1">
                    + {part.value}
                  </div>
                );
              } else if (part.removed) {
                return (
                  <div key={index} className="bg-red-100 dark:bg-red-900 p-1">
                    - {part.value}
                  </div>
                );
              } else {
                return (
                  <div key={index} className="p-1">
                    {part.value}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
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
          <button
            onClick={handleSwap}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            <ArrowLeftRightIcon className="h-5 w-5 mr-2" />
            Swap
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={diffType}
            onChange={(e) => setDiffType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="lines">Line by Line</option>
            <option value="words">Word by Word</option>
            <option value="chars">Character by Character</option>
          </select>
          <button
            onClick={handleProcess}
            disabled={processing || (!value1 && !value2)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Comparing...
              </>
            ) : (
              'Compare'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="value1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Original Text
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="value1"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter original text"
              rows={6}
            />
          </div>
        </div>

        <div>
          <label htmlFor="value2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Modified Text
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DocumentDuplicateIcon className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="value2"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter modified text"
              rows={6}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-md bg-red-50 dark:bg-red-900">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {renderDiff()}

      {showHistory && history.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Comparisons
          </h3>
          <div className="mt-2 space-y-2">
            {history.map((comparison, index) => (
              <div
                key={index}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <div className="text-sm text-gray-900 dark:text-white">
                  {comparison.text1} ↔ {comparison.text2}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {comparison.type} • {comparison.date.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextDiff; 