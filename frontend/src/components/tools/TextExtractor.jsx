import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  LinkIcon,
  EnvelopeIcon,
  PhoneIcon,
  HashtagIcon,
  AtSymbolIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const TextExtractor = ({ 
  onProcess, 
  processing = false,
  initialValue = '',
  showHistory = true
}) => {
  const [value, setValue] = useState(initialValue);
  const [extractType, setExtractType] = useState('urls');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  const extractTypes = [
    { 
      value: 'urls', 
      label: 'URLs',
      icon: LinkIcon,
      pattern: /(https?:\/\/[^\s]+)/g,
      description: 'Extract all URLs from the text'
    },
    { 
      value: 'emails', 
      label: 'Email Addresses',
      icon: EnvelopeIcon,
      pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      description: 'Extract all email addresses from the text'
    },
    { 
      value: 'phones', 
      label: 'Phone Numbers',
      icon: PhoneIcon,
      pattern: /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g,
      description: 'Extract all phone numbers from the text'
    },
    { 
      value: 'hashtags', 
      label: 'Hashtags',
      icon: HashtagIcon,
      pattern: /#\w+/g,
      description: 'Extract all hashtags from the text'
    },
    { 
      value: 'mentions', 
      label: 'Mentions',
      icon: AtSymbolIcon,
      pattern: /@\w+/g,
      description: 'Extract all @mentions from the text'
    },
    { 
      value: 'creditcards', 
      label: 'Credit Card Numbers',
      icon: CreditCardIcon,
      pattern: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
      description: 'Extract all credit card numbers from the text'
    }
  ];

  useEffect(() => {
    if (value) {
      extractContent();
    } else {
      setResult(null);
    }
  }, [value, extractType]);

  const handleClear = () => {
    setValue('');
    setResult(null);
    setError(null);
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result.join('\n'));
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
        extractType,
        result
      });
    }
  };

  const extractContent = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult(null);
        return;
      }

      const type = extractTypes.find(t => t.value === extractType);
      if (!type) {
        setError('Invalid extraction type selected.');
        return;
      }

      const matches = value.match(type.pattern) || [];
      setResult(matches);

      if (showHistory) {
        const entry = {
          text: value.slice(0, 50) + (value.length > 50 ? '...' : ''),
          extractType,
          count: matches.length,
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Error extracting content. Please check your input.');
      console.error('Extraction error:', err);
    }
  };

  const Icon = extractTypes.find(t => t.value === extractType)?.icon || DocumentTextIcon;

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
            value={extractType}
            onChange={(e) => setExtractType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {extractTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleProcess}
            disabled={processing || !value}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Extracting...
              </>
            ) : (
              'Extract'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text to Extract From
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
              placeholder="Enter text to extract from"
              rows={6}
            />
          </div>
        </div>

        {result && (
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Extracted {extractTypes.find(t => t.value === extractType)?.label}
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {result.length} found
              </span>
            </div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="result"
                value={result.join('\n')}
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
            Recent Extractions
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
                  {extractTypes.find(type => type.value === entry.extractType)?.label} • {entry.count} found • {entry.date.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextExtractor; 