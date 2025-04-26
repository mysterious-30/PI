import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

const TextMerger = ({ 
  onProcess, 
  processing = false,
  initialValues = ['', ''],
  showHistory = true
}) => {
  const [values, setValues] = useState(initialValues);
  const [separator, setSeparator] = useState('\n');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [options, setOptions] = useState({
    trim: true,
    removeEmpty: true,
    addNewline: true,
    preserveOrder: true
  });

  const separators = [
    { value: '\n', label: 'New Line' },
    { value: ' ', label: 'Space' },
    { value: ',', label: 'Comma' },
    { value: ';', label: 'Semicolon' },
    { value: '|', label: 'Pipe' },
    { value: '\t', label: 'Tab' },
    { value: 'custom', label: 'Custom' }
  ];

  useEffect(() => {
    if (values.some(v => v)) {
      mergeText();
    } else {
      setResult(null);
    }
  }, [values, separator, options]);

  const handleClear = () => {
    setValues(['', '']);
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
        values,
        separator,
        options,
        result
      });
    }
  };

  const handleAddInput = () => {
    setValues([...values, '']);
  };

  const handleRemoveInput = (index) => {
    if (values.length > 2) {
      setValues(values.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (index, value) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  const mergeText = () => {
    try {
      setError(null);
      
      if (!values.some(v => v)) {
        setResult(null);
        return;
      }

      let processedValues = values.map(v => options.trim ? v.trim() : v);
      
      if (options.removeEmpty) {
        processedValues = processedValues.filter(v => v);
      }

      if (options.preserveOrder) {
        processedValues = processedValues.filter((_, i) => values[i]);
      }

      let merged = processedValues.join(separator);
      
      if (options.addNewline && separator !== '\n') {
        merged += '\n';
      }

      setResult(merged);

      if (showHistory) {
        const entry = {
          text: values.map(v => v.slice(0, 20) + (v.length > 20 ? '...' : '')).join(' | '),
          separator: separator === '\n' ? 'New Line' : separator,
          valueCount: processedValues.length,
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Error merging text. Please check your input and options.');
      console.error('Merging error:', err);
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
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {separators.map(sep => (
              <option key={sep.value} value={sep.value}>
                {sep.label}
              </option>
            ))}
          </select>
          {separator === 'custom' && (
            <input
              type="text"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter custom separator"
            />
          )}
          <button
            onClick={handleProcess}
            disabled={processing || !values.some(v => v)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Merging...
              </>
            ) : (
              'Merge'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-4">
          {values.map((value, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="flex-1">
                <label htmlFor={`value-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Text {index + 1}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id={`value-${index}`}
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={`Enter text ${index + 1}`}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-7">
                {index === values.length - 1 && (
                  <button
                    onClick={handleAddInput}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                )}
                {values.length > 2 && (
                  <button
                    onClick={() => handleRemoveInput(index)}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
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
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Remove Empty Inputs</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.addNewline}
              onChange={(e) => setOptions({ ...options, addNewline: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Add Newline</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.preserveOrder}
              onChange={(e) => setOptions({ ...options, preserveOrder: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Preserve Order</span>
          </label>
        </div>

        {result && (
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Merged Text
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {result.length} characters
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
            Recent Merges
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
                  {entry.separator} • {entry.valueCount} inputs • {entry.date.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextMerger; 