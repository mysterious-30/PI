import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const CurrencyConverter = ({ 
  onProcess, 
  processing = false,
  initialAmount = '',
  initialFromCurrency = 'USD',
  initialToCurrency = 'EUR',
  showHistory = true,
  apiKey = ''
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);
  const [result, setResult] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  const currencies = {
    USD: { name: 'US Dollar', symbol: '$' },
    EUR: { name: 'Euro', symbol: '€' },
    GBP: { name: 'British Pound', symbol: '£' },
    JPY: { name: 'Japanese Yen', symbol: '¥' },
    AUD: { name: 'Australian Dollar', symbol: 'A$' },
    CAD: { name: 'Canadian Dollar', symbol: 'C$' },
    CHF: { name: 'Swiss Franc', symbol: 'Fr' },
    CNY: { name: 'Chinese Yuan', symbol: '¥' },
    INR: { name: 'Indian Rupee', symbol: '₹' },
    BRL: { name: 'Brazilian Real', symbol: 'R$' },
    RUB: { name: 'Russian Ruble', symbol: '₽' },
    ZAR: { name: 'South African Rand', symbol: 'R' },
    MXN: { name: 'Mexican Peso', symbol: '$' },
    SGD: { name: 'Singapore Dollar', symbol: 'S$' },
    NZD: { name: 'New Zealand Dollar', symbol: 'NZ$' }
  };

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (amount && exchangeRate) {
      convert();
    }
  }, [amount, exchangeRate]);

  const fetchExchangeRate = async () => {
    try {
      setError(null);
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const data = await response.json();
      
      if (data.rates && data.rates[toCurrency]) {
        setExchangeRate(data.rates[toCurrency]);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid currency pair');
      }
    } catch (err) {
      setError('Failed to fetch exchange rate. Please try again later.');
      console.error('Exchange rate error:', err);
    }
  };

  const handleClear = () => {
    setAmount('');
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
        amount,
        fromCurrency,
        toCurrency,
        result,
        exchangeRate,
        lastUpdated
      });
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convert = () => {
    if (exchangeRate) {
      const convertedAmount = parseFloat(amount) * exchangeRate;
      setResult(convertedAmount.toFixed(2));
      
      if (showHistory) {
        const conversion = {
          from: `${currencies[fromCurrency].symbol}${amount}`,
          to: `${currencies[toCurrency].symbol}${convertedAmount.toFixed(2)}`,
          date: new Date()
        };
        setHistory(prev => [conversion, ...prev].slice(0, 5));
      }
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
          disabled={processing || !amount || !fromCurrency || !toCurrency}
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
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              From
            </label>
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {Object.entries(currencies).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {code} - {name}
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
            <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To
            </label>
            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {Object.entries(currencies).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {code} - {name}
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
            {currencies[toCurrency].symbol}{result}
          </div>
          {lastUpdated && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Exchange rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}
              <br />
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}
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

export default CurrencyConverter; 