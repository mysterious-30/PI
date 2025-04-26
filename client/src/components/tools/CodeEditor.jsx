import React, { useState, useRef } from 'react';
import { ClipboardIcon, TrashIcon, ArrowPathIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

const CodeEditor = ({ 
  onProcess, 
  processing = false,
  language = 'javascript',
  initialValue = '',
  supportedLanguages = ['javascript', 'python', 'java', 'cpp', 'html', 'css']
}) => {
  const [code, setCode] = useState(initialValue);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [showCopied, setShowCopied] = useState(false);
  const textareaRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleClear = () => {
    setCode('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleProcess = () => {
    if (onProcess) {
      onProcess(code, selectedLanguage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setCode(code.substring(0, start) + '  ' + code.substring(end));
      setTimeout(() => {
        textareaRef.current.selectionStart = start + 2;
        textareaRef.current.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            disabled={!code}
          >
            <ClipboardIcon className="h-5 w-5 mr-2" />
            {showCopied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            disabled={!code}
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Clear
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="language" className="sr-only">
              Language
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleProcess}
            disabled={!code || processing}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Processing...
              </>
            ) : (
              'Process'
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-2 left-2">
          <CodeBracketIcon className="h-5 w-5 text-gray-400" />
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="block w-full h-96 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter your code here..."
          spellCheck="false"
        />
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {code.length} characters
          </span>
          {code.length > 0 && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Language: {selectedLanguage}</p>
        <p>Lines: {code.split('\n').length}</p>
      </div>
    </div>
  );
};

export default CodeEditor; 