import React, { useState, useRef } from 'react';
import { 
  CalculatorIcon, 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline';

const Calculator = ({ 
  onProcess, 
  processing = false,
  type = 'basic',
  supportedOperations = ['add', 'subtract', 'multiply', 'divide'],
  precision = 2
}) => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [operation, setOperation] = useState('');
  const [result, setResult] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const resultRef = useRef(null);

  const handleClear = () => {
    setInput1('');
    setInput2('');
    setOperation('');
    setResult(null);
  };

  const handleCopy = async () => {
    if (result !== null) {
      try {
        await navigator.clipboard.writeText(result.toString());
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
        input1: parseFloat(input1),
        input2: parseFloat(input2),
        operation,
        type
      });
    } else {
      // Default calculation if no onProcess provided
      let calculatedResult;
      switch (operation) {
        case 'add':
          calculatedResult = parseFloat(input1) + parseFloat(input2);
          break;
        case 'subtract':
          calculatedResult = parseFloat(input1) - parseFloat(input2);
          break;
        case 'multiply':
          calculatedResult = parseFloat(input1) * parseFloat(input2);
          break;
        case 'divide':
          calculatedResult = parseFloat(input1) / parseFloat(input2);
          break;
        default:
          return;
      }
      setResult(calculatedResult.toFixed(precision));
    }
  };

  const validateInput = (value) => {
    return /^-?\d*\.?\d*$/.test(value);
  };

  const handleInputChange = (e, setter) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setter(value);
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
          disabled={!input1 || !input2 || !operation || processing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              Calculating...
            </>
          ) : (
            'Calculate'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="input1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First Number
          </label>
          <input
            type="text"
            id="input1"
            value={input1}
            onChange={(e) => handleInputChange(e, setInput1)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter first number"
          />
        </div>

        <div>
          <label htmlFor="operation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Operation
          </label>
          <select
            id="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select operation</option>
            {supportedOperations.map((op) => (
              <option key={op} value={op}>
                {op.charAt(0).toUpperCase() + op.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="input2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Second Number
          </label>
          <input
            type="text"
            id="input2"
            value={input2}
            onChange={(e) => handleInputChange(e, setInput2)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter second number"
          />
        </div>
      </div>

      {result !== null && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Result
            </h3>
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              <ClipboardIcon className="h-4 w-4 mr-2" />
              {showCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div
            ref={resultRef}
            className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xl font-mono text-gray-900 dark:text-white"
          >
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator; 