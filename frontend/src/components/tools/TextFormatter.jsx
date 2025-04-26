import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  PlusIcon,
  MinusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const TextFormatter = ({ 
  onProcess, 
  processing = false,
  initialValue = '',
  initialFormat = 'trim',
  showHistory = true
}) => {
  const [value, setValue] = useState(initialValue);
  const [format, setFormat] = useState(initialFormat);
  const [result, setResult] = useState('');
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [options, setOptions] = useState({
    prefix: '',
    suffix: '',
    padding: 0,
    paddingChar: ' ',
    paddingSide: 'both',
    repeat: 1,
    reverse: false,
    invertCase: false,
    removeSpaces: false,
    removeNewlines: false,
    removeSpecialChars: false
  });

  const formats = [
    { value: 'trim', label: 'Trim Whitespace' },
    { value: 'prefix', label: 'Add Prefix' },
    { value: 'suffix', label: 'Add Suffix' },
    { value: 'pad', label: 'Pad Text' },
    { value: 'repeat', label: 'Repeat Text' },
    { value: 'reverse', label: 'Reverse Text' },
    { value: 'invert', label: 'Invert Case' },
    { value: 'clean', label: 'Clean Text' }
  ];

  useEffect(() => {
    if (value && format) {
      formatText();
    }
  }, [value, format, options]);

  const handleClear = () => {
    setValue('');
    setResult('');
    setError(null);
    setOptions({
      prefix: '',
      suffix: '',
      padding: 0,
      paddingChar: ' ',
      paddingSide: 'both',
      repeat: 1,
      reverse: false,
      invertCase: false,
      removeSpaces: false,
      removeNewlines: false,
      removeSpecialChars: false
    });
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
        format,
        options,
        result
      });
    }
  };

  const handleOptionChange = (key, value) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatText = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult('');
        return;
      }

      let formattedValue = value;

      // Apply selected format
      switch (format) {
        case 'trim':
          formattedValue = value.trim();
          break;
        case 'prefix':
          formattedValue = options.prefix + value;
          break;
        case 'suffix':
          formattedValue = value + options.suffix;
          break;
        case 'pad':
          const padding = options.paddingChar.repeat(options.padding);
          if (options.paddingSide === 'left') {
            formattedValue = padding + value;
          } else if (options.paddingSide === 'right') {
            formattedValue = value + padding;
          } else {
            formattedValue = padding + value + padding;
          }
          break;
        case 'repeat':
          formattedValue = value.repeat(options.repeat);
          break;
        case 'reverse':
          formattedValue = value.split('').reverse().join('');
          break;
        case 'invert':
          formattedValue = value.split('').map(char => {
            if (char === char.toUpperCase()) {
              return char.toLowerCase();
            }
            return char.toUpperCase();
          }).join('');
          break;
        case 'clean':
          if (options.removeSpaces) {
            formattedValue = formattedValue.replace(/\s+/g, '');
          }
          if (options.removeNewlines) {
            formattedValue = formattedValue.replace(/\n/g, '');
          }
          if (options.removeSpecialChars) {
            formattedValue = formattedValue.replace(/[^a-zA-Z0-9\s]/g, '');
          }
          break;
        default:
          formattedValue = value;
      }

      setResult(formattedValue);

      if (showHistory) {
        const conversion = {
          from: value,
          to: formattedValue,
          format,
          date: new Date()
        };
        setHistory(prev => [conversion, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Invalid formatting. Please check your input.');
      console.error('Formatting error:', err);
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
        <button
          onClick={handleProcess}
          disabled={processing || !value || !format}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              Formatting...
            </>
          ) : (
            'Format'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text
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
              placeholder="Enter text to format"
              rows={4}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Format
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {formats.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {format === 'prefix' && (
            <div>
              <label htmlFor="prefix" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Prefix
              </label>
              <input
                type="text"
                id="prefix"
                value={options.prefix}
                onChange={(e) => handleOptionChange('prefix', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter prefix"
              />
            </div>
          )}

          {format === 'suffix' && (
            <div>
              <label htmlFor="suffix" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Suffix
              </label>
              <input
                type="text"
                id="suffix"
                value={options.suffix}
                onChange={(e) => handleOptionChange('suffix', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter suffix"
              />
            </div>
          )}

          {format === 'pad' && (
            <div className="space-y-2">
              <div>
                <label htmlFor="padding" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Padding Length
                </label>
                <div className="mt-1 flex items-center">
                  <button
                    onClick={() => handleOptionChange('padding', Math.max(0, options.padding - 1))}
                    className="p-2 rounded-l-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    id="padding"
                    value={options.padding}
                    onChange={(e) => handleOptionChange('padding', Math.max(0, parseInt(e.target.value) || 0))}
                    className="block w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    min="0"
                  />
                  <button
                    onClick={() => handleOptionChange('padding', options.padding + 1)}
                    className="p-2 rounded-r-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="paddingChar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Padding Character
                </label>
                <input
                  type="text"
                  id="paddingChar"
                  value={options.paddingChar}
                  onChange={(e) => handleOptionChange('paddingChar', e.target.value || ' ')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  maxLength="1"
                />
              </div>

              <div>
                <label htmlFor="paddingSide" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Padding Side
                </label>
                <select
                  id="paddingSide"
                  value={options.paddingSide}
                  onChange={(e) => handleOptionChange('paddingSide', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
          )}

          {format === 'repeat' && (
            <div>
              <label htmlFor="repeat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Repeat Count
              </label>
              <div className="mt-1 flex items-center">
                <button
                  onClick={() => handleOptionChange('repeat', Math.max(1, options.repeat - 1))}
                  className="p-2 rounded-l-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  id="repeat"
                  value={options.repeat}
                  onChange={(e) => handleOptionChange('repeat', Math.max(1, parseInt(e.target.value) || 1))}
                  className="block w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="1"
                />
                <button
                  onClick={() => handleOptionChange('repeat', options.repeat + 1)}
                  className="p-2 rounded-r-md border border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {format === 'clean' && (
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="removeSpaces"
                  checked={options.removeSpaces}
                  onChange={(e) => handleOptionChange('removeSpaces', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="removeSpaces" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remove Spaces
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="removeNewlines"
                  checked={options.removeNewlines}
                  onChange={(e) => handleOptionChange('removeNewlines', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="removeNewlines" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remove Newlines
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="removeSpecialChars"
                  checked={options.removeSpecialChars}
                  onChange={(e) => handleOptionChange('removeSpecialChars', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="removeSpecialChars" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remove Special Characters
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-md bg-red-50 dark:bg-red-900">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 rounded-md border border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Result
            </h3>
            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ClipboardIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 text-lg font-mono text-gray-900 dark:text-white">
            {result}
          </div>
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Formatting
          </h3>
          <div className="mt-2 space-y-2">
            {history.map((conversion, index) => (
              <div
                key={index}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <div className="text-sm text-gray-900 dark:text-white">
                  {conversion.from} → {conversion.to}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {conversion.format} • {conversion.date.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextFormatter; 