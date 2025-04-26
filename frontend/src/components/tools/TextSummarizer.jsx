import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  DocumentMagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const TextSummarizer = ({ 
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
    summaryType: 'extractive',
    length: 'medium',
    focus: 'general',
    preserveFormatting: true,
    includeKeyPoints: true
  });

  const summaryTypes = [
    { id: 'extractive', label: 'Extractive', description: 'Selects important sentences from the text' },
    { id: 'abstractive', label: 'Abstractive', description: 'Generates new sentences to summarize the text' },
    { id: 'key-points', label: 'Key Points', description: 'Extracts main points and ideas' }
  ];

  const summaryLengths = [
    { id: 'short', label: 'Short', description: 'Very concise summary (10-20% of original)' },
    { id: 'medium', label: 'Medium', description: 'Balanced summary (20-30% of original)' },
    { id: 'long', label: 'Long', description: 'Detailed summary (30-40% of original)' }
  ];

  const summaryFocuses = [
    { id: 'general', label: 'General', description: 'Balanced summary of all content' },
    { id: 'technical', label: 'Technical', description: 'Focus on technical details and data' },
    { id: 'conceptual', label: 'Conceptual', description: 'Focus on main ideas and concepts' },
    { id: 'actionable', label: 'Actionable', description: 'Focus on practical steps and recommendations' }
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

  const processText = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult(null);
        return;
      }

      // Mock summarization for demonstration
      // In a real app, you would use a summarization API or algorithm
      const sentences = value.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = value.split(/\s+/).filter(w => w.length > 0);
      
      let summaryLength = Math.floor(sentences.length * 0.3); // Default to medium length
      if (options.length === 'short') {
        summaryLength = Math.floor(sentences.length * 0.2);
      } else if (options.length === 'long') {
        summaryLength = Math.floor(sentences.length * 0.4);
      }

      let summary = '';
      if (options.summaryType === 'extractive') {
        // Simple extractive summarization
        summary = sentences.slice(0, summaryLength).join('. ') + '.';
      } else if (options.summaryType === 'abstractive') {
        // Mock abstractive summarization
        summary = `[Abstractive Summary] This is a generated summary of the text focusing on ${options.focus} aspects. The original text contains ${words.length} words and ${sentences.length} sentences.`;
      } else {
        // Mock key points extraction
        summary = `Key Points:\n1. Main idea from the text\n2. Important supporting point\n3. Additional significant detail\n4. Final key takeaway`;
      }

      setResult(summary);

      if (showHistory) {
        const entry = {
          summaryType: options.summaryType,
          length: options.length,
          focus: options.focus,
          originalLength: words.length,
          summaryLength: summary.split(/\s+/).length,
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Error summarizing text. Please try again.');
      console.error('Summarization error:', err);
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
                Summarizing...
              </>
            ) : (
              <>
                <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Summarize
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text to Summarize
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
              placeholder="Enter text to summarize"
              rows={6}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Summary Type
            </h3>
            <div className="space-y-2">
              {summaryTypes.map(type => (
                <label key={type.id} className="flex items-start">
                  <input
                    type="radio"
                    checked={options.summaryType === type.id}
                    onChange={() => setOptions({ ...options, summaryType: type.id })}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{type.label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Summary Length
            </h3>
            <div className="space-y-2">
              {summaryLengths.map(length => (
                <label key={length.id} className="flex items-start">
                  <input
                    type="radio"
                    checked={options.length === length.id}
                    onChange={() => setOptions({ ...options, length: length.id })}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{length.label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{length.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Summary Focus
            </h3>
            <div className="space-y-2">
              {summaryFocuses.map(focus => (
                <label key={focus.id} className="flex items-start">
                  <input
                    type="radio"
                    checked={options.focus === focus.id}
                    onChange={() => setOptions({ ...options, focus: focus.id })}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{focus.label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{focus.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.preserveFormatting}
              onChange={(e) => setOptions({ ...options, preserveFormatting: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Preserve Formatting</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.includeKeyPoints}
              onChange={(e) => setOptions({ ...options, includeKeyPoints: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Key Points</span>
          </label>
        </div>

        {result && (
          <div className="space-y-4">
            <div>
              <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Summary
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
            Recent Summaries
          </h3>
          <div className="mt-2 space-y-2">
            {history.map((entry, index) => (
              <div
                key={index}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <div className="text-sm text-gray-900 dark:text-white">
                  {summaryTypes.find(t => t.id === entry.summaryType)?.label} • {entry.length} • {entry.focus}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.originalLength} words → {entry.summaryLength} words
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

export default TextSummarizer; 