import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const CaseConverter = ({ 
  onProcess, 
  processing = false,
  initialValue = '',
  initialFromCase = 'original',
  initialToCase = 'uppercase',
  showHistory = true
}) => {
  const [value, setValue] = useState(initialValue);
  const [fromCase, setFromCase] = useState(initialFromCase);
  const [toCase, setToCase] = useState(initialToCase);
  const [result, setResult] = useState('');
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  const cases = [
    { value: 'original', label: 'Original' },
    { value: 'uppercase', label: 'UPPERCASE' },
    { value: 'lowercase', label: 'lowercase' },
    { value: 'titlecase', label: 'Title Case' },
    { value: 'sentencecase', label: 'Sentence case' },
    { value: 'camelcase', label: 'camelCase' },
    { value: 'pascalcase', label: 'PascalCase' },
    { value: 'snakecase', label: 'snake_case' },
    { value: 'kebabcase', label: 'kebab-case' },
    { value: 'constantcase', label: 'CONSTANT_CASE' }
  ];

  useEffect(() => {
    if (value && fromCase && toCase) {
      convert();
    }
  }, [value, fromCase, toCase]);

  const handleClear = () => {
    setValue('');
    setResult('');
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
        fromCase,
        toCase,
        result
      });
    }
  };

  const handleSwap = () => {
    setFromCase(toCase);
    setToCase(fromCase);
  };

  const convert = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult('');
        return;
      }

      let convertedValue = value;

      // Convert to title case
      const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };

      // Convert to sentence case
      const toSentenceCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

      // Convert to camel case
      const toCamelCase = (str) => {
        return str
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+/g, '');
      };

      // Convert to Pascal case
      const toPascalCase = (str) => {
        return str
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '');
      };

      // Convert to snake case
      const toSnakeCase = (str) => {
        return str
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_');
      };

      // Convert to kebab case
      const toKebabCase = (str) => {
        return str
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('-');
      };

      // Convert to constant case
      const toConstantCase = (str) => {
        return str
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toUpperCase())
          .join('_');
      };

      switch (toCase) {
        case 'uppercase':
          convertedValue = value.toUpperCase();
          break;
        case 'lowercase':
          convertedValue = value.toLowerCase();
          break;
        case 'titlecase':
          convertedValue = toTitleCase(value);
          break;
        case 'sentencecase':
          convertedValue = toSentenceCase(value);
          break;
        case 'camelcase':
          convertedValue = toCamelCase(value);
          break;
        case 'pascalcase':
          convertedValue = toPascalCase(value);
          break;
        case 'snakecase':
          convertedValue = toSnakeCase(value);
          break;
        case 'kebabcase':
          convertedValue = toKebabCase(value);
          break;
        case 'constantcase':
          convertedValue = toConstantCase(value);
          break;
        default:
          convertedValue = value;
      }

      setResult(convertedValue);

      if (showHistory) {
        const conversion = {
          from: value,
          to: convertedValue,
          date: new Date()
        };
        setHistory(prev => [conversion, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Invalid conversion. Please check your input.');
      console.error('Conversion error:', err);
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
          disabled={processing || !value || !fromCase || !toCase}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              Converting...
            </>
          ) : (
            'Convert'
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
              placeholder="Enter text to convert"
              rows={4}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromCase" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              From
            </label>
            <select
              id="fromCase"
              value={fromCase}
              onChange={(e) => setFromCase(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {cases.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSwap}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowsRightLeftIcon className="h-5 w-5" />
            </button>
          </div>

          <div>
            <label htmlFor="toCase" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To
            </label>
            <select
              id="toCase"
              value={toCase}
              onChange={(e) => setToCase(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {cases.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
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
            Recent Conversions
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
                  {conversion.date.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseConverter; 