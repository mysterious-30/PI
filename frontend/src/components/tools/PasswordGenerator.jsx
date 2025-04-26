import React, { useState, useRef, useEffect } from 'react';
import { 
  KeyIcon,
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const PasswordGenerator = ({ 
  onProcess, 
  processing = false,
  initialLength = 12,
  minLength = 8,
  maxLength = 32,
  showStrength = true
}) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(initialLength);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [strength, setStrength] = useState(0);
  const passwordRef = useRef(null);

  const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  useEffect(() => {
    if (showStrength) {
      calculateStrength();
    }
  }, [password, showStrength]);

  const handleClear = () => {
    setPassword('');
    setLength(initialLength);
    setOptions({
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true
    });
    setStrength(0);
  };

  const handleCopy = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy password:', err);
      }
    }
  };

  const handleProcess = () => {
    if (onProcess) {
      onProcess({
        password,
        length,
        options,
        strength
      });
    } else {
      generatePassword();
    }
  };

  const generatePassword = () => {
    let charPool = '';
    let newPassword = '';

    // Build character pool based on selected options
    Object.entries(options).forEach(([key, enabled]) => {
      if (enabled) {
        charPool += characters[key];
      }
    });

    // Ensure at least one character from each selected type
    Object.entries(options).forEach(([key, enabled]) => {
      if (enabled && characters[key]) {
        const randomIndex = Math.floor(Math.random() * characters[key].length);
        newPassword += characters[key][randomIndex];
      }
    });

    // Fill the rest of the password with random characters
    for (let i = newPassword.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      newPassword += charPool[randomIndex];
    }

    // Shuffle the password
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(newPassword);
  };

  const calculateStrength = () => {
    let score = 0;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

    // Length score
    if (password.length >= 12) score += 3;
    else if (password.length >= 8) score += 2;
    else if (password.length >= 6) score += 1;

    // Character type score
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSymbols) score += 1;

    // Deduct points for consecutive characters
    const consecutiveChars = /(.)\1{2,}/.test(password);
    if (consecutiveChars) score -= 1;

    // Deduct points for sequential characters
    const sequentialChars = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
    if (sequentialChars) score -= 1;

    setStrength(Math.max(0, Math.min(5, score)));
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-orange-500';
      case 4:
        return 'bg-blue-500';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return 'Unknown';
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
          disabled={processing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              Generating...
            </>
          ) : (
            'Generate'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="length" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Length: {length}
          </label>
          <input
            type="range"
            id="length"
            min={minLength}
            max={maxLength}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Options
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(options).map(([key, value]) => (
              <label key={key} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ClipboardIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-1 relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            readOnly
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <KeyIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {showStrength && password && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password Strength
            </h3>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {getStrengthLabel()}
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className={`h-2 rounded-full ${getStrengthColor()}`}
              style={{ width: `${(strength / 5) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator; 