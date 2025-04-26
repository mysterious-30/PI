import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  ArrowsRightLeftIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const TimeZoneConverter = ({ 
  onProcess, 
  processing = false,
  initialDate = new Date(),
  initialFromTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  initialToTimeZone = 'UTC',
  showHistory = true
}) => {
  const [date, setDate] = useState(initialDate);
  const [fromTimeZone, setFromTimeZone] = useState(initialFromTimeZone);
  const [toTimeZone, setToTimeZone] = useState(initialToTimeZone);
  const [result, setResult] = useState(null);
  const [format, setFormat] = useState('12h');
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  const timeZones = Intl.supportedValuesOf('timeZone').map(zone => ({
    value: zone,
    label: zone.replace(/_/g, ' '),
    offset: new Date().toLocaleString('en-US', { timeZone: zone, timeZoneName: 'longOffset' }).split(' ').pop()
  }));

  useEffect(() => {
    if (date && fromTimeZone && toTimeZone) {
      convert();
    }
  }, [date, fromTimeZone, toTimeZone, format]);

  const handleClear = () => {
    setDate(new Date());
    setResult(null);
    setError(null);
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(formatResult(result));
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
        date,
        fromTimeZone,
        toTimeZone,
        result,
        format
      });
    }
  };

  const handleSwap = () => {
    setFromTimeZone(toTimeZone);
    setToTimeZone(fromTimeZone);
  };

  const formatResult = (date) => {
    const options = {
      timeZone: toTimeZone,
      hour12: format === '12h',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'long'
    };
    return date.toLocaleString('en-US', options);
  };

  const convert = () => {
    try {
      const fromDate = new Date(date);
      const toDate = new Date(fromDate.toLocaleString('en-US', { timeZone: toTimeZone }));
      setResult(toDate);
      setError(null);

      if (showHistory) {
        const conversion = {
          from: fromDate.toLocaleString('en-US', { 
            timeZone: fromTimeZone,
            hour12: format === '12h',
            timeZoneName: 'short'
          }),
          to: formatResult(toDate),
          date: new Date()
        };
        setHistory(prev => [conversion, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Invalid time zone or date. Please try again.');
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
          disabled={processing || !date || !fromTimeZone || !toTimeZone}
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
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date and Time
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="datetime-local"
              id="date"
              value={date.toISOString().slice(0, 16)}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromTimeZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              From
            </label>
            <select
              id="fromTimeZone"
              value={fromTimeZone}
              onChange={(e) => setFromTimeZone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {timeZones.map(({ value, label, offset }) => (
                <option key={value} value={value}>
                  {label} ({offset})
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
            <label htmlFor="toTimeZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To
            </label>
            <select
              id="toTimeZone"
              value={toTimeZone}
              onChange={(e) => setToTimeZone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {timeZones.map(({ value, label, offset }) => (
                <option key={value} value={value}>
                  {label} ({offset})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Time Format
        </label>
        <div className="flex items-center space-x-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="12h"
              checked={format === '12h'}
              onChange={(e) => setFormat(e.target.value)}
              className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">12-hour</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="24h"
              checked={format === '24h'}
              onChange={(e) => setFormat(e.target.value)}
              className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">24-hour</span>
          </label>
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
            {formatResult(result)}
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

export default TimeZoneConverter; 