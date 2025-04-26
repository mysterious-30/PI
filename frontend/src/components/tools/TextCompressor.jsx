import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const TextCompressor = ({ 
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
    operation: 'compress',
    algorithm: 'base64',
    compressionLevel: 6
  });

  const algorithms = [
    { 
      id: 'base64', 
      label: 'Base64', 
      description: 'Encodes binary data as ASCII characters',
      supportsCompression: false,
      supportsDecompression: false
    },
    { 
      id: 'gzip', 
      label: 'GZIP', 
      description: 'Lossless data compression using DEFLATE algorithm',
      supportsCompression: true,
      supportsDecompression: true
    },
    { 
      id: 'lz77', 
      label: 'LZ77', 
      description: 'Dictionary-based compression algorithm',
      supportsCompression: true,
      supportsDecompression: true
    },
    { 
      id: 'huffman', 
      label: 'Huffman', 
      description: 'Entropy encoding algorithm',
      supportsCompression: true,
      supportsDecompression: true
    },
    { 
      id: 'rle', 
      label: 'RLE', 
      description: 'Run-length encoding for repeated characters',
      supportsCompression: true,
      supportsDecompression: true
    }
  ];

  useEffect(() => {
    if (value) {
      processText();
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
        options,
        result
      });
    }
  };

  const base64Encode = (text) => {
    return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode('0x' + p1);
    }));
  };

  const base64Decode = (text) => {
    return decodeURIComponent(Array.prototype.map.call(atob(text), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  };

  const lz77Compress = (text) => {
    let result = '';
    let i = 0;
    while (i < text.length) {
      let bestMatch = { offset: 0, length: 0 };
      for (let offset = 1; offset <= Math.min(i, 255); offset++) {
        let length = 0;
        while (i + length < text.length && text[i + length] === text[i - offset + length % offset]) {
          length++;
        }
        if (length > bestMatch.length) {
          bestMatch = { offset, length };
        }
      }
      if (bestMatch.length > 2) {
        result += `(${bestMatch.offset},${bestMatch.length})`;
        i += bestMatch.length;
      } else {
        result += text[i];
        i++;
      }
    }
    return result;
  };

  const lz77Decompress = (text) => {
    let result = '';
    let i = 0;
    while (i < text.length) {
      if (text[i] === '(') {
        const match = text.slice(i).match(/\((\d+),(\d+)\)/);
        if (match) {
          const offset = parseInt(match[1]);
          const length = parseInt(match[2]);
          for (let j = 0; j < length; j++) {
            result += result[result.length - offset + j % offset];
          }
          i += match[0].length;
        } else {
          result += text[i];
          i++;
        }
      } else {
        result += text[i];
        i++;
      }
    }
    return result;
  };

  const huffmanCompress = (text) => {
    // Simple implementation for demonstration
    const frequency = {};
    for (const char of text) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    const codes = {};
    let code = '';
    Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .forEach(([char]) => {
        codes[char] = code;
        code = '0' + code;
      });
    return Object.entries(codes)
      .map(([char, code]) => `${char}:${code}`)
      .join('|') + '|' + text.split('').map(char => codes[char]).join('');
  };

  const huffmanDecompress = (text) => {
    // Simple implementation for demonstration
    const [codesStr, compressed] = text.split('|').slice(0, -1);
    const codes = {};
    codesStr.split('|').forEach(pair => {
      const [char, code] = pair.split(':');
      codes[code] = char;
    });
    let result = '';
    let current = '';
    for (const bit of compressed) {
      current += bit;
      if (codes[current]) {
        result += codes[current];
        current = '';
      }
    }
    return result;
  };

  const rleCompress = (text) => {
    let result = '';
    let count = 1;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === text[i + 1]) {
        count++;
      } else {
        result += count > 1 ? `${count}${text[i]}` : text[i];
        count = 1;
      }
    }
    return result;
  };

  const rleDecompress = (text) => {
    let result = '';
    let i = 0;
    while (i < text.length) {
      const match = text.slice(i).match(/^(\d+)(.)/);
      if (match) {
        const count = parseInt(match[1]);
        const char = match[2];
        result += char.repeat(count);
        i += match[0].length;
      } else {
        result += text[i];
        i++;
      }
    }
    return result;
  };

  const processText = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult(null);
        return;
      }

      let processedText = '';
      const algorithm = algorithms.find(a => a.id === options.algorithm);

      if (options.operation === 'compress') {
        switch (options.algorithm) {
          case 'base64':
            processedText = base64Encode(value);
            break;
          case 'gzip':
            // Mock implementation for demonstration
            processedText = `GZIP compressed (level ${options.compressionLevel}): ${value.length} → ${Math.floor(value.length * 0.7)} bytes`;
            break;
          case 'lz77':
            processedText = lz77Compress(value);
            break;
          case 'huffman':
            processedText = huffmanCompress(value);
            break;
          case 'rle':
            processedText = rleCompress(value);
            break;
        }
      } else {
        switch (options.algorithm) {
          case 'base64':
            processedText = base64Decode(value);
            break;
          case 'gzip':
            // Mock implementation for demonstration
            processedText = `GZIP decompressed: ${value}`;
            break;
          case 'lz77':
            processedText = lz77Decompress(value);
            break;
          case 'huffman':
            processedText = huffmanDecompress(value);
            break;
          case 'rle':
            processedText = rleDecompress(value);
            break;
        }
      }

      setResult(processedText);

      if (showHistory) {
        const entry = {
          operation: options.operation,
          algorithm: options.algorithm,
          originalLength: value.length,
          resultLength: processedText.length,
          compressionRatio: options.operation === 'compress' ? 
            ((value.length - processedText.length) / value.length * 100).toFixed(2) : 
            ((processedText.length - value.length) / value.length * 100).toFixed(2),
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Error processing text. Please check your input and try again.');
      console.error('Processing error:', err);
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
                Processing...
              </>
            ) : (
              <>
                {options.operation === 'compress' ? (
                  <ArrowUpIcon className="h-5 w-5 mr-2" />
                ) : (
                  <ArrowDownIcon className="h-5 w-5 mr-2" />
                )}
                {options.operation === 'compress' ? 'Compress' : 'Decompress'}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text to {options.operation === 'compress' ? 'Compress' : 'Decompress'}
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
              placeholder={`Enter text to ${options.operation}`}
              rows={6}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Compression Options
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Operation</label>
                <select
                  value={options.operation}
                  onChange={(e) => setOptions({ ...options, operation: e.target.value })}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="compress">Compress</option>
                  <option value="decompress">Decompress</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Algorithm</label>
                <select
                  value={options.algorithm}
                  onChange={(e) => setOptions({ ...options, algorithm: e.target.value })}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {algorithms.map(algorithm => (
                    <option key={algorithm.id} value={algorithm.id}>
                      {algorithm.label}
                    </option>
                  ))}
                </select>
              </div>
              {options.algorithm === 'gzip' && (
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">Compression Level</label>
                  <input
                    type="range"
                    min="1"
                    max="9"
                    value={options.compressionLevel}
                    onChange={(e) => setOptions({ ...options, compressionLevel: parseInt(e.target.value) })}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">
                    {options.compressionLevel}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Algorithm Information
            </h3>
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {algorithms.find(a => a.id === options.algorithm)?.description}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                {options.operation === 'compress' ? 'Compression' : 'Decompression'} supported: {
                  options.operation === 'compress' ? 
                    algorithms.find(a => a.id === options.algorithm)?.supportsCompression ? 'Yes' : 'No' :
                    algorithms.find(a => a.id === options.algorithm)?.supportsDecompression ? 'Yes' : 'No'
                }
              </p>
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div>
              <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Result
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DocumentDuplicateIcon className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="result"
                  value={result}
                  readOnly
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            Recent Operations
          </h3>
          <div className="mt-2 space-y-2">
            {history.map((entry, index) => (
              <div
                key={index}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <div className="text-sm text-gray-900 dark:text-white">
                  {algorithms.find(a => a.id === entry.algorithm)?.label} • {entry.operation}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.originalLength} → {entry.resultLength} bytes ({entry.compressionRatio}%)
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

export default TextCompressor; 