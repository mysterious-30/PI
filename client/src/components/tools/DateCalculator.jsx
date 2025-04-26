import React, { useState, useRef } from 'react';
import { 
  CalendarIcon,
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const DateCalculator = ({ 
  onProcess, 
  processing = false,
  initialDate = new Date(),
  supportedOperations = ['add', 'subtract', 'difference'],
  supportedUnits = ['days', 'weeks', 'months', 'years', 'hours', 'minutes', 'seconds']
}) => {
  const [date1, setDate1] = useState(initialDate);
  const [date2, setDate2] = useState(new Date());
  const [operation, setOperation] = useState('difference');
  const [unit, setUnit] = useState('days');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const resultRef = useRef(null);

  const handleClear = () => {
    setDate1(initialDate);
    setDate2(new Date());
    setOperation('difference');
    setUnit('days');
    setAmount('');
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
        date1,
        date2,
        operation,
        unit,
        amount: parseFloat(amount)
      });
    } else {
      // Default calculation if no onProcess provided
      const calculatedResult = calculateResult();
      setResult(calculatedResult);
    }
  };

  const calculateResult = () => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = d2 - d1;

    switch (operation) {
      case 'difference':
        return calculateDifference(diff, unit);
      case 'add':
        return addToDate(d1, amount, unit);
      case 'subtract':
        return subtractFromDate(d1, amount, unit);
      default:
        return null;
    }
  };

  const calculateDifference = (diff, unit) => {
    const conversions = {
      seconds: 1000,
      minutes: 1000 * 60,
      hours: 1000 * 60 * 60,
      days: 1000 * 60 * 60 * 24,
      weeks: 1000 * 60 * 60 * 24 * 7,
      months: 1000 * 60 * 60 * 24 * 30.44, // Average month length
      years: 1000 * 60 * 60 * 24 * 365.25  // Average year length
    };

    return (diff / conversions[unit]).toFixed(2);
  };

  const addToDate = (date, amount, unit) => {
    const newDate = new Date(date);
    const value = parseFloat(amount);

    switch (unit) {
      case 'seconds':
        newDate.setSeconds(newDate.getSeconds() + value);
        break;
      case 'minutes':
        newDate.setMinutes(newDate.getMinutes() + value);
        break;
      case 'hours':
        newDate.setHours(newDate.getHours() + value);
        break;
      case 'days':
        newDate.setDate(newDate.getDate() + value);
        break;
      case 'weeks':
        newDate.setDate(newDate.getDate() + value * 7);
        break;
      case 'months':
        newDate.setMonth(newDate.getMonth() + value);
        break;
      case 'years':
        newDate.setFullYear(newDate.getFullYear() + value);
        break;
    }

    return newDate.toLocaleString();
  };

  const subtractFromDate = (date, amount, unit) => {
    return addToDate(date, -amount, unit);
  };

  const validateInput = (value) => {
    return /^-?\d*\.?\d*$/.test(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (validateInput(value)) {
      setAmount(value);
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
          disabled={processing || (operation !== 'difference' && !amount)}
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
          <label htmlFor="operation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Operation
          </label>
          <select
            id="operation"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {supportedOperations.map((op) => (
              <option key={op} value={op}>
                {op.charAt(0).toUpperCase() + op.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Unit
          </label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {supportedUnits.map((u) => (
              <option key={u} value={u}>
                {u.charAt(0).toUpperCase() + u.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First Date
          </label>
          <div className="mt-1 relative">
            <input
              type="datetime-local"
              id="date1"
              value={date1.toISOString().slice(0, 16)}
              onChange={(e) => setDate1(new Date(e.target.value))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {operation === 'difference' ? (
          <div>
            <label htmlFor="date2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Second Date
            </label>
            <div className="mt-1 relative">
              <input
                type="datetime-local"
                id="date2"
                value={date2.toISOString().slice(0, 16)}
                onChange={(e) => setDate2(new Date(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter amount"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}
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
            {operation === 'difference' ? `${result} ${unit}` : result}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateCalculator; 