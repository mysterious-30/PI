import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const TextValidator = ({ 
  onProcess, 
  processing = false,
  initialValue = '',
  showHistory = true
}) => {
  const [value, setValue] = useState(initialValue);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [options, setOptions] = useState({
    minLength: 0,
    maxLength: 1000,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecial: false,
    noWhitespace: false,
    noEmojis: false,
    customPattern: '',
    customPatternEnabled: false
  });

  const validationRules = [
    { id: 'email', label: 'Email Address', pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/ },
    { id: 'url', label: 'URL', pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/ },
    { id: 'phone', label: 'Phone Number', pattern: /^\+?[\d\s-()]{10,}$/ },
    { id: 'date', label: 'Date (YYYY-MM-DD)', pattern: /^\d{4}-\d{2}-\d{2}$/ },
    { id: 'time', label: 'Time (HH:MM)', pattern: /^([01]\d|2[0-3]):([0-5]\d)$/ },
    { id: 'ip', label: 'IP Address', pattern: /^(\d{1,3}\.){3}\d{1,3}$/ },
    { id: 'hex', label: 'Hexadecimal', pattern: /^[0-9A-Fa-f]+$/ },
    { id: 'binary', label: 'Binary', pattern: /^[01]+$/ },
    { id: 'username', label: 'Username', pattern: /^[a-zA-Z0-9_]{3,20}$/ },
    { id: 'password', label: 'Password', pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ }
  ];

  useEffect(() => {
    if (value) {
      validateText();
    } else {
      setResult(null);
    }
  }, [value, options]);

  const handleClear = () => {
    setValue('');
    setResult(null);
    setError(null);
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
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
        options,
        result
      });
    }
  };

  const validateText = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult(null);
        return;
      }

      const validations = {
        length: {
          valid: value.length >= options.minLength && value.length <= options.maxLength,
          message: `Length must be between ${options.minLength} and ${options.maxLength} characters`
        },
        uppercase: {
          valid: !options.requireUppercase || /[A-Z]/.test(value),
          message: 'Must contain at least one uppercase letter'
        },
        lowercase: {
          valid: !options.requireLowercase || /[a-z]/.test(value),
          message: 'Must contain at least one lowercase letter'
        },
        numbers: {
          valid: !options.requireNumbers || /\d/.test(value),
          message: 'Must contain at least one number'
        },
        special: {
          valid: !options.requireSpecial || /[^A-Za-z0-9]/.test(value),
          message: 'Must contain at least one special character'
        },
        whitespace: {
          valid: !options.noWhitespace || !/\s/.test(value),
          message: 'Must not contain whitespace'
        },
        emojis: {
          valid: !options.noEmojis || !/[\u{1F300}-\u{1F9FF}]/gu.test(value),
          message: 'Must not contain emojis'
        },
        custom: {
          valid: !options.customPatternEnabled || new RegExp(options.customPattern).test(value),
          message: 'Must match custom pattern'
        }
      };

      // Validate against selected rules
      const ruleValidations = validationRules.reduce((acc, rule) => {
        acc[rule.id] = {
          valid: new RegExp(rule.pattern).test(value),
          message: `Must be a valid ${rule.label}`
        };
        return acc;
      }, {});

      const allValidations = { ...validations, ...ruleValidations };
      const isValid = Object.values(allValidations).every(v => v.valid);

      setResult({
        isValid,
        validations: allValidations
      });

      if (showHistory) {
        const entry = {
          text: value.slice(0, 50) + (value.length > 50 ? '...' : ''),
          isValid,
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Error validating text. Please check your input and patterns.');
      console.error('Validation error:', err);
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
          <button
            onClick={handleProcess}
            disabled={processing || !value}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Validating...
              </>
            ) : (
              'Validate'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text to Validate
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
              placeholder="Enter text to validate"
              rows={6}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Basic Rules
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Minimum Length</label>
                <input
                  type="number"
                  value={options.minLength}
                  onChange={(e) => setOptions({ ...options, minLength: parseInt(e.target.value) || 0 })}
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Maximum Length</label>
                <input
                  type="number"
                  value={options.maxLength}
                  onChange={(e) => setOptions({ ...options, maxLength: parseInt(e.target.value) || 1000 })}
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={options.requireUppercase}
                    onChange={(e) => setOptions({ ...options, requireUppercase: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Require Uppercase</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={options.requireLowercase}
                    onChange={(e) => setOptions({ ...options, requireLowercase: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Require Lowercase</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={options.requireNumbers}
                    onChange={(e) => setOptions({ ...options, requireNumbers: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Require Numbers</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={options.requireSpecial}
                    onChange={(e) => setOptions({ ...options, requireSpecial: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Require Special Characters</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={options.noWhitespace}
                    onChange={(e) => setOptions({ ...options, noWhitespace: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">No Whitespace</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={options.noEmojis}
                    onChange={(e) => setOptions({ ...options, noEmojis: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">No Emojis</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Pattern
            </h3>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={options.customPatternEnabled}
                  onChange={(e) => setOptions({ ...options, customPatternEnabled: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable Custom Pattern</span>
              </label>
              <input
                type="text"
                value={options.customPattern}
                onChange={(e) => setOptions({ ...options, customPattern: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter regex pattern"
                disabled={!options.customPatternEnabled}
              />
            </div>

            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Common Patterns
            </h3>
            <div className="space-y-2">
              {validationRules.map(rule => (
                <label key={rule.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={options[rule.id]}
                    onChange={(e) => setOptions({ ...options, [rule.id]: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{rule.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="p-4 rounded-md border border-gray-300 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Validation Results
                </h3>
                <div className="flex items-center">
                  {result.isValid ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                  <span className="ml-2 text-sm font-medium">
                    {result.isValid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(result.validations).map(([key, validation]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <div className="flex items-center">
                      {validation.valid ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 text-red-500" />
                      )}
                      {!validation.valid && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {validation.message}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ClipboardIcon className="h-5 w-5 mr-2" />
                Copy Results
              </button>
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
            Recent Validations
          </h3>
          <div className="mt-2 space-y-2">
            {history.map((entry, index) => (
              <div
                key={index}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {entry.text}
                  </div>
                  <div className="flex items-center">
                    {entry.isValid ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.date.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextValidator; 