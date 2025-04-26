import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  ArrowLeftRightIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const TextEncoder = ({ 
  onProcess, 
  processing = false,
  initialValue = '',
  showHistory = true
}) => {
  const [value, setValue] = useState(initialValue);
  const [operation, setOperation] = useState('encode');
  const [encoding, setEncoding] = useState('base64');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  const encodings = [
    { value: 'base64', label: 'Base64' },
    { value: 'url', label: 'URL' },
    { value: 'html', label: 'HTML' },
    { value: 'hex', label: 'Hexadecimal' },
    { value: 'binary', label: 'Binary' },
    { value: 'ascii', label: 'ASCII' }
  ];

  useEffect(() => {
    if (value) {
      processText();
    } else {
      setResult(null);
    }
  }, [value, operation, encoding]);

  const handleClear = () => {
    setValue('');
    setResult(null);
    setError(null);
  };

  const handleSwap = () => {
    if (result) {
      setValue(result);
      setResult(value);
    }
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
        operation,
        encoding,
        result
      });
    }
  };

  const processText = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult(null);
        return;
      }

      let processed;
      switch (encoding) {
        case 'base64':
          processed = operation === 'encode' 
            ? btoa(unescape(encodeURIComponent(value)))
            : decodeURIComponent(escape(atob(value)));
          break;
        case 'url':
          processed = operation === 'encode'
            ? encodeURIComponent(value)
            : decodeURIComponent(value);
          break;
        case 'html':
          processed = operation === 'encode'
            ? value.replace(/[&<>"']/g, char => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
              }[char]))
            : value.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, entity => ({
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#39;': "'"
              }[entity]));
          break;
        case 'hex':
          processed = operation === 'encode'
            ? Array.from(value).map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('')
            : value.match(/.{1,2}/g)?.map(hex => String.fromCharCode(parseInt(hex, 16))).join('') || '';
          break;
        case 'binary':
          processed = operation === 'encode'
            ? Array.from(value).map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
            : value.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
          break;
        case 'ascii':
          processed = operation === 'encode'
            ? Array.from(value).map(char => char.charCodeAt(0)).join(' ')
            : value.split(' ').map(code => String.fromCharCode(parseInt(code))).join('');
          break;
        default:
          processed = value;
      }

      setResult(processed);

      if (showHistory) {
        const entry = {
          text: value.slice(0, 50) + (value.length > 50 ? '...' : ''),
          operation,
          encoding,
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError(`Invalid ${operation} operation for ${encoding} encoding. Please check your input.`);
      console.error('Encoding error:', err);
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
          <button
            onClick={handleSwap}
            disabled={!result}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeftRightIcon className="h-5 w-5 mr-2" />
            Swap
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </select>
          <select
            value={encoding}
            onChange={(e) => setEncoding(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {encodings.map(enc => (
              <option key={enc.value} value={enc.value}>
                {enc.label}
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
                Processing...
              </>
            ) : (
              operation === 'encode' ? 'Encode' : 'Decode'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {operation === 'encode' ? 'Text to Encode' : 'Text to Decode'}
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
              placeholder={`Enter text to ${operation}`}
              rows={6}
            />
          </div>
        </div>

        {result && (
          <div>
            <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {operation === 'encode' ? 'Encoded Text' : 'Decoded Text'}
            </label>
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
            Recent Operations
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
                  {entry.operation} • {entry.encoding} • {entry.date.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEncoder; 