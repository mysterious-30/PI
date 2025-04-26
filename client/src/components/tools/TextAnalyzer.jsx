import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const TextAnalyzer = ({ 
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

  useEffect(() => {
    if (value) {
      analyzeText();
    } else {
      setResult(null);
    }
  }, [value]);

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
        result
      });
    }
  };

  const analyzeText = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult(null);
        return;
      }

      // Basic statistics
      const charCount = value.length;
      const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
      const lineCount = value.split('\n').length;
      const sentenceCount = value.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
      const paragraphCount = value.split(/\n\s*\n/).filter(para => para.trim().length > 0).length;

      // Character frequency
      const charFrequency = {};
      value.split('').forEach(char => {
        charFrequency[char] = (charFrequency[char] || 0) + 1;
      });

      // Word frequency
      const wordFrequency = {};
      value.toLowerCase().match(/\b\w+\b/g)?.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });

      // Reading time (assuming 200 words per minute)
      const readingTime = Math.ceil(wordCount / 200);

      // Most common words
      const mostCommonWords = Object.entries(wordFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word, count]) => ({ word, count }));

      // Most common characters
      const mostCommonChars = Object.entries(charFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([char, count]) => ({ char, count }));

      // Text type analysis
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(value);
      const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(value);

      const analysis = {
        basic: {
          characters: charCount,
          words: wordCount,
          lines: lineCount,
          sentences: sentenceCount,
          paragraphs: paragraphCount,
          readingTime: `${readingTime} minute${readingTime !== 1 ? 's' : ''}`
        },
        frequency: {
          words: mostCommonWords,
          characters: mostCommonChars
        },
        type: {
          hasUppercase,
          hasLowercase,
          hasNumbers,
          hasSpecialChars,
          hasEmojis
        }
      };

      setResult(analysis);

      if (showHistory) {
        const analysis = {
          text: value.slice(0, 50) + (value.length > 50 ? '...' : ''),
          stats: {
            words: wordCount,
            characters: charCount
          },
          date: new Date()
        };
        setHistory(prev => [analysis, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Invalid text analysis. Please check your input.');
      console.error('Analysis error:', err);
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
          disabled={processing || !value}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
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
              placeholder="Enter text to analyze"
              rows={6}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-md bg-red-50 dark:bg-red-900">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-md border border-gray-300 dark:border-gray-600">
              <div className="flex items-center">
                <DocumentIcon className="h-5 w-5 text-gray-400" />
                <h3 className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Basic Statistics
                </h3>
              </div>
              <dl className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Characters</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{result.basic.characters}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Words</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{result.basic.words}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Lines</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{result.basic.lines}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Sentences</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{result.basic.sentences}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Paragraphs</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{result.basic.paragraphs}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Reading Time</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{result.basic.readingTime}</dd>
                </div>
              </dl>
            </div>

            <div className="p-4 rounded-md border border-gray-300 dark:border-gray-600">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-gray-400" />
                <h3 className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Most Common Words
                </h3>
              </div>
              <dl className="mt-2 space-y-1">
                {result.frequency.words.map(({ word, count }, index) => (
                  <div key={index} className="flex justify-between">
                    <dt className="text-sm text-gray-500 dark:text-gray-400">{word}</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{count}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="p-4 rounded-md border border-gray-300 dark:border-gray-600">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <h3 className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Text Type
                </h3>
              </div>
              <dl className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Uppercase</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{result.type.hasUppercase ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Lowercase</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{result.type.hasLowercase ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Numbers</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{result.type.hasNumbers ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Special Characters</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{result.type.hasSpecialChars ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Emojis</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{result.type.hasEmojis ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              <ClipboardIcon className="h-5 w-5 mr-2" />
              Copy Analysis
            </button>
          </div>
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Analysis
          </h3>
          <div className="mt-2 space-y-2">
            {history.map((analysis, index) => (
              <div
                key={index}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <div className="text-sm text-gray-900 dark:text-white">
                  {analysis.text}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {analysis.stats.words} words • {analysis.stats.characters} chars • {analysis.date.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalyzer; 