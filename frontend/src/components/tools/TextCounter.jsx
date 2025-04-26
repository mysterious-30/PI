import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const TextCounter = ({ 
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
    includeWhitespace: false,
    countEmojis: true,
    countUrls: true,
    countEmails: true,
    countHashtags: true,
    countMentions: true
  });

  useEffect(() => {
    if (value) {
      countText();
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

  const countText = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult(null);
        return;
      }

      const text = value;
      const words = text.trim().split(/\s+/);
      const characters = options.includeWhitespace ? text : text.replace(/\s/g, '');
      const lines = text.split('\n');
      const sentences = text.split(/[.!?]+/).filter(s => s.trim());
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
      
      // Calculate reading time (assuming 200 words per minute)
      const readingTime = Math.ceil(words.length / 200);

      // Count special elements
      const urls = options.countUrls ? text.match(/\bhttps?:\/\/\S+/gi) || [] : [];
      const emails = options.countEmails ? text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [] : [];
      const hashtags = options.countHashtags ? text.match(/#\w+/g) || [] : [];
      const mentions = options.countMentions ? text.match(/@\w+/g) || [] : [];
      const emojis = options.countEmojis ? text.match(/[\u{1F300}-\u{1F9FF}]/gu) || [] : [];

      // Count character types
      const uppercase = text.match(/[A-Z]/g) || [];
      const lowercase = text.match(/[a-z]/g) || [];
      const numbers = text.match(/[0-9]/g) || [];
      const special = text.match(/[^A-Za-z0-9\s]/g) || [];

      // Calculate word frequency
      const wordFrequency = {};
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanWord) {
          wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
        }
      });

      // Get top 5 most frequent words
      const topWords = Object.entries(wordFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word, count]) => ({ word, count }));

      const stats = {
        basic: {
          characters: characters.length,
          words: words.length,
          lines: lines.length,
          sentences: sentences.length,
          paragraphs: paragraphs.length,
          readingTime: `${readingTime} minute${readingTime !== 1 ? 's' : ''}`
        },
        special: {
          urls: urls.length,
          emails: emails.length,
          hashtags: hashtags.length,
          mentions: mentions.length,
          emojis: emojis.length
        },
        characters: {
          uppercase: uppercase.length,
          lowercase: lowercase.length,
          numbers: numbers.length,
          special: special.length
        },
        topWords
      };

      setResult(stats);

      if (showHistory) {
        const entry = {
          text: value.slice(0, 50) + (value.length > 50 ? '...' : ''),
          stats: {
            words: words.length,
            characters: characters.length
          },
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Error counting text. Please check your input.');
      console.error('Counting error:', err);
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
                Counting...
              </>
            ) : (
              'Count'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text to Analyze
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

        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.includeWhitespace}
              onChange={(e) => setOptions({ ...options, includeWhitespace: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Whitespace</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.countEmojis}
              onChange={(e) => setOptions({ ...options, countEmojis: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Count Emojis</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.countUrls}
              onChange={(e) => setOptions({ ...options, countUrls: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Count URLs</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.countEmails}
              onChange={(e) => setOptions({ ...options, countEmails: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Count Emails</span>
          </label>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md border border-gray-300 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Basic Statistics
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Characters</span>
                    <span className="text-sm font-medium">{result.basic.characters}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Words</span>
                    <span className="text-sm font-medium">{result.basic.words}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Lines</span>
                    <span className="text-sm font-medium">{result.basic.lines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Sentences</span>
                    <span className="text-sm font-medium">{result.basic.sentences}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Paragraphs</span>
                    <span className="text-sm font-medium">{result.basic.paragraphs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Reading Time</span>
                    <span className="text-sm font-medium">{result.basic.readingTime}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md border border-gray-300 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Elements
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">URLs</span>
                    <span className="text-sm font-medium">{result.special.urls}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Emails</span>
                    <span className="text-sm font-medium">{result.special.emails}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Hashtags</span>
                    <span className="text-sm font-medium">{result.special.hashtags}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Mentions</span>
                    <span className="text-sm font-medium">{result.special.mentions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Emojis</span>
                    <span className="text-sm font-medium">{result.special.emojis}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md border border-gray-300 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Character Types
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Uppercase</span>
                    <span className="text-sm font-medium">{result.characters.uppercase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Lowercase</span>
                    <span className="text-sm font-medium">{result.characters.lowercase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Numbers</span>
                    <span className="text-sm font-medium">{result.characters.numbers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Special</span>
                    <span className="text-sm font-medium">{result.characters.special}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md border border-gray-300 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Top Words
                </h3>
                <div className="space-y-1">
                  {result.topWords.map((word, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{word.word}</span>
                      <span className="text-sm font-medium">{word.count}</span>
                    </div>
                  ))}
                </div>
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
            Recent Analyses
          </h3>
          <div className="mt-2 space-y-2">
            {history.map((entry, index) => (
              <div
                key={index}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <div className="text-sm text-gray-900 dark:text-white">
                  {entry.text}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.stats.words} words • {entry.stats.characters} characters • {entry.date.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextCounter; 