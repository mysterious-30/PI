import React, { useState, useRef } from 'react';
import { ClipboardIcon, DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';

const TextEditor = ({ initialValue = '', onProcess, processing = false }) => {
  const [text, setText] = useState(initialValue);
  const [showCopied, setShowCopied] = useState(false);
  const textareaRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleClear = () => {
    setText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleProcess = () => {
    if (onProcess) {
      onProcess(text);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            disabled={!text}
          >
            <ClipboardIcon className="h-5 w-5 mr-2" />
            {showCopied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            disabled={!text}
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Clear
          </button>
        </div>
        <button
          onClick={handleProcess}
          disabled={!text || processing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : 'Process'}
        </button>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={10}
          placeholder="Enter your text here..."
        />
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {text.length} characters
          </span>
          {text.length > 0 && (
            <button
              onClick={() => setText('')}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextEditor; 