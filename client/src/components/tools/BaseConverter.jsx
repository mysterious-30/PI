import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  ArrowsRightLeftIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';

const BaseConverter = ({ 
  onProcess, 
  processing = false,
  initialValue = '',
  initialFromBase = 10,
  initialToBase = 16,
  showHistory = true
}) => {
  const [value, setValue] = useState(initialValue);
  const [fromBase, setFromBase] = useState(initialFromBase);
  const [toBase, setToBase] = useState(initialToBase);
  const [result, setResult] = useState('');
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  const bases = [
    { value: 2, label: 'Binary (2)', prefix: '0b' },
    { value: 8, label: 'Octal (8)', prefix: '0o' },
    { value: 10, label: 'Decimal (10)', prefix: '' },
    { value: 16, label: 'Hexadecimal (16)', prefix: '0x' }
  ];

  useEffect(() => {
    if (value && fromBase && toBase) {
      convert();
    }
  }, [value, fromBase, toBase]);

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
        fromBase,
        toBase,
        result
      });
    }
  };

  const handleSwap = () => {
    setFromBase(toBase);
    setToBase(fromBase);
  };

  const validateInput = (input, base) => {
    if (!input) return true;
    
    const validChars = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^-?\d+$/,
      16: /^[0-9A-Fa-f]+$/
    };

    if (!validChars[base].test(input)) {
      setError(`Invalid input for ${bases.find(b => b.value === base).label}`);
      return false;
    }
    return true;
  };

  const convert = () => {
    try {
      setError(null);
      
      if (!validateInput(value, fromBase)) {
        return;
      }

      // Remove prefix if present
      const cleanValue = value.replace(/^0[bxo]/, '');
      
      // Convert to decimal first
      const decimalValue = parseInt(cleanValue, fromBase);
      
      if (isNaN(decimalValue)) {
        throw new Error('Invalid number');
      }

      // Convert to target base
      const convertedValue = decimalValue.toString(toBase).toUpperCase();
      const prefix = bases.find(b => b.value === toBase).prefix;
      setResult(prefix + convertedValue);

      if (showHistory) {
        const conversion = {
          from: `${bases.find(b => b.value === fromBase).prefix}${value}`,
          to: result,
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
          disabled={processing || !value || !fromBase || !toBase}
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
            Value
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HashtagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value.toUpperCase())}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={`Enter ${bases.find(b => b.value === fromBase).label} number`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromBase" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              From
            </label>
            <select
              id="fromBase"
              value={fromBase}
              onChange={(e) => setFromBase(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {bases.map(({ value, label }) => (
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
            <label htmlFor="toBase" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To
            </label>
            <select
              id="toBase"
              value={toBase}
              onChange={(e) => setToBase(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {bases.map(({ value, label }) => (
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

export default BaseConverter; 