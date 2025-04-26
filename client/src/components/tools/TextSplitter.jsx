import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ScissorsIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const TextSplitter = ({ 
  onProcess, 
  processing = false,
  initialValue = '',
  showHistory = true
}) => {
  const [value, setValue] = useState(initialValue);
  const [splitType, setSplitType] = useState('lines');
  const [splitValue, setSplitValue] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [options, setOptions] = useState({
    trim: true,
    removeEmpty: true,
    preserveDelimiter: false
  });

  const splitTypes = [
    { 
      value: 'lines', 
      label: 'By Lines',
      description: 'Split text into lines',
      placeholder: 'Number of lines per chunk'
    },
    { 
      value: 'characters', 
      label: 'By Characters',
      description: 'Split text by character count',
      placeholder: 'Number of characters per chunk'
    },
    { 
      value: 'words', 
      label: 'By Words',
      description: 'Split text by word count',
      placeholder: 'Number of words per chunk'
    },
    { 
      value: 'delimiter', 
      label: 'By Delimiter',
      description: 'Split text by a specific character or string',
      placeholder: 'Enter delimiter (e.g., comma, space)'
    },
    { 
      value: 'regex', 
      label: 'By Regular Expression',
      description: 'Split text using a regular expression',
      placeholder: 'Enter regex pattern'
    }
  ];

  useEffect(() => {
    if (value) {
      splitText();
    } else {
      setResult(null);
    }
  }, [value, splitType, splitValue, options]);

  const handleClear = () => {
    setValue('');
    setSplitValue('');
    setResult(null);
    setError(null);
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result.join('\n\n---\n\n'));
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
        splitType,
        splitValue,
        options,
        result
      });
    }
  };

  const splitText = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult(null);
        return;
      }

      let chunks = [];
      const text = options.trim ? value.trim() : value;

      switch (splitType) {
        case 'lines':
          const lineCount = parseInt(splitValue) || 1;
          const lines = text.split('\n');
          for (let i = 0; i < lines.length; i += lineCount) {
            chunks.push(lines.slice(i, i + lineCount).join('\n'));
          }
          break;
        case 'characters':
          const charCount = parseInt(splitValue) || 1;
          for (let i = 0; i < text.length; i += charCount) {
            chunks.push(text.slice(i, i + charCount));
          }
          break;
        case 'words':
          const wordCount = parseInt(splitValue) || 1;
          const words = text.split(/\s+/);
          for (let i = 0; i < words.length; i += wordCount) {
            chunks.push(words.slice(i, i + wordCount).join(' '));
          }
          break;
        case 'delimiter':
          if (!splitValue) {
            setError('Please enter a delimiter');
            return;
          }
          chunks = text.split(splitValue);
          if (options.preserveDelimiter) {
            chunks = chunks.map((chunk, i) => i < chunks.length - 1 ? chunk + splitValue : chunk);
          }
          break;
        case 'regex':
          if (!splitValue) {
            setError('Please enter a regular expression');
            return;
          }
          try {
            const regex = new RegExp(splitValue, 'g');
            chunks = text.split(regex);
            if (options.preserveDelimiter) {
              const matches = text.match(regex) || [];
              chunks = chunks.map((chunk, i) => i < matches.length ? chunk + matches[i] : chunk);
            }
          } catch (err) {
            setError('Invalid regular expression');
            return;
          }
          break;
        default:
          chunks = [text];
      }

      if (options.removeEmpty) {
        chunks = chunks.filter(chunk => chunk.trim());
      }

      setResult(chunks);

      if (showHistory) {
        const entry = {
          text: value.slice(0, 50) + (value.length > 50 ? '...' : ''),
          splitType,
          splitValue,
          chunkCount: chunks.length,
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Error splitting text. Please check your input and options.');
      console.error('Splitting error:', err);
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
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {splitTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={splitValue}
            onChange={(e) => setSplitValue(e.target.value)}
            placeholder={splitTypes.find(t => t.value === splitType)?.placeholder}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleProcess}
            disabled={processing || !value}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Splitting...
              </>
            ) : (
              'Split'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text to Split
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
              placeholder="Enter text to split"
              rows={6}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.trim}
              onChange={(e) => setOptions({ ...options, trim: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Trim Whitespace</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.removeEmpty}
              onChange={(e) => setOptions({ ...options, removeEmpty: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Remove Empty Chunks</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.preserveDelimiter}
              onChange={(e) => setOptions({ ...options, preserveDelimiter: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Preserve Delimiter</span>
          </label>
        </div>

        {result && (
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Split Text
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {result.length} chunks
              </span>
            </div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DocumentDuplicateIcon className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="result"
                value={result.join('\n\n---\n\n')}
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
            Recent Splits
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
                  {splitTypes.find(type => type.value === entry.splitType)?.label} • {entry.chunkCount} chunks • {entry.date.toLocaleString()}
                </div>
                {entry.splitValue && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Split by: {entry.splitValue}
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

export default TextSplitter; 