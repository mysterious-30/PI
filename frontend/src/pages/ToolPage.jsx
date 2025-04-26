import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchToolBySlug, trackToolUsage } from '../store/slices/toolsSlice';
import { toggleFavoriteTool } from '../store/slices/userSlice';
import {
  StarIcon,
  StarIcon as StarIconSolid,
  ShareIcon,
  ClipboardIcon,
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/24/solid';

const ToolPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTool, loading, error } = useSelector((state) => state.tools);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    dispatch(fetchToolBySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (currentTool) {
      dispatch(trackToolUsage(currentTool._id));
    }
  }, [dispatch, currentTool]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setErrorMessage('');
  };

  const processInput = async () => {
    if (!input.trim()) {
      setErrorMessage('Please enter some input');
      return;
    }

    setIsProcessing(true);
    try {
      let result;
      switch (currentTool.type) {
        case 'text':
          result = processText(input);
          break;
        case 'number':
          result = processNumber(input);
          break;
        case 'conversion':
          result = await processConversion(input);
          break;
        default:
          throw new Error('Unsupported tool type');
      }
      setOutput(result);
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const processText = (text) => {
    switch (currentTool.slug) {
      case 'uppercase':
        return text.toUpperCase();
      case 'lowercase':
        return text.toLowerCase();
      case 'capitalize':
        return text
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      case 'reverse':
        return text.split('').reverse().join('');
      case 'count':
        return {
          characters: text.length,
          words: text.trim().split(/\s+/).length,
          lines: text.split('\n').length
        };
      default:
        return text;
    }
  };

  const processNumber = (number) => {
    const num = parseFloat(number);
    if (isNaN(num)) {
      throw new Error('Please enter a valid number');
    }

    switch (currentTool.slug) {
      case 'square':
        return num * num;
      case 'cube':
        return num * num * num;
      case 'square-root':
        return Math.sqrt(num);
      case 'factorial':
        if (num < 0) throw new Error('Factorial is not defined for negative numbers');
        if (num > 170) throw new Error('Number too large for factorial calculation');
        let result = 1;
        for (let i = 2; i <= num; i++) {
          result *= i;
        }
        return result;
      default:
        return num;
    }
  };

  const processConversion = async (value) => {
    // Implement conversion logic here
    // This would typically involve API calls for currency, unit conversions, etc.
    return value;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentTool.name,
        text: `Check out this ${currentTool.name} tool!`,
        url: window.location.href
      });
    }
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(toggleFavoriteTool(currentTool._id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !currentTool) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            Tool not found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The tool you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{currentTool.name} - ToolsHub</title>
        <meta name="description" content={currentTool.description} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentTool.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {currentTool.description}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleToggleFavorite}
                className="text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                title={user?.favoriteTools?.includes(currentTool._id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                {user?.favoriteTools?.includes(currentTool._id) ? (
                  <StarIconFilled className="h-6 w-6 text-yellow-500" />
                ) : (
                  <StarIcon className="h-6 w-6" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                title="Share tool"
              >
                <ShareIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Input
              </label>
              <div className="mt-1">
                {currentTool.type === 'text' ? (
                  <textarea
                    id="input"
                    rows={4}
                    value={input}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter your text here..."
                  />
                ) : (
                  <input
                    type={currentTool.type === 'number' ? 'number' : 'text'}
                    id="input"
                    value={input}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder={`Enter your ${currentTool.type} here...`}
                  />
                )}
              </div>
              {errorMessage && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={processInput}
                disabled={isProcessing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  'Process'
                )}
              </button>
            </div>

            {output && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="output"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Output
                  </label>
                  <button
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                    title="Copy to clipboard"
                  >
                    <ClipboardIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-1">
                  {typeof output === 'object' ? (
                    <pre className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 dark:bg-gray-700 p-4 overflow-x-auto">
                      {JSON.stringify(output, null, 2)}
                    </pre>
                  ) : (
                    <textarea
                      id="output"
                      rows={4}
                      value={output}
                      readOnly
                      className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    />
                  )}
                </div>
                {isCopied && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Copied to clipboard!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolPage; 