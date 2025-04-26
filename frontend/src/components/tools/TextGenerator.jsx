import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const TextGenerator = ({ 
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
    template: 'lorem',
    length: 'medium',
    style: 'formal',
    format: 'paragraph',
    includeNumbers: true,
    includeSpecialChars: false
  });

  const templates = [
    { id: 'lorem', label: 'Lorem Ipsum', description: 'Classic placeholder text' },
    { id: 'tech', label: 'Technical', description: 'Technical documentation style' },
    { id: 'business', label: 'Business', description: 'Business and corporate style' },
    { id: 'creative', label: 'Creative', description: 'Creative writing style' },
    { id: 'academic', label: 'Academic', description: 'Academic and research style' },
    { id: 'legal', label: 'Legal', description: 'Legal document style' },
    { id: 'medical', label: 'Medical', description: 'Medical and healthcare style' }
  ];

  const lengths = [
    { id: 'short', label: 'Short', description: '1-2 paragraphs' },
    { id: 'medium', label: 'Medium', description: '3-5 paragraphs' },
    { id: 'long', label: 'Long', description: '6-10 paragraphs' }
  ];

  const styles = [
    { id: 'formal', label: 'Formal', description: 'Professional and structured' },
    { id: 'casual', label: 'Casual', description: 'Conversational and relaxed' },
    { id: 'technical', label: 'Technical', description: 'Detailed and precise' },
    { id: 'simple', label: 'Simple', description: 'Clear and straightforward' }
  ];

  const formats = [
    { id: 'paragraph', label: 'Paragraph', description: 'Continuous text' },
    { id: 'bullets', label: 'Bullet Points', description: 'List format' },
    { id: 'numbered', label: 'Numbered List', description: 'Sequential points' },
    { id: 'mixed', label: 'Mixed', description: 'Combination of formats' }
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

  const generateLoremIpsum = (length) => {
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    const paragraphs = Math.max(1, Math.floor(length / 100));
    return Array(paragraphs).fill(lorem).join('\n\n');
  };

  const generateTechnical = (length) => {
    const tech = "The system architecture comprises multiple interconnected components. Each module implements specific functionality through well-defined interfaces. Data flows through the pipeline following established protocols. Error handling ensures system stability and reliability.";
    const paragraphs = Math.max(1, Math.floor(length / 100));
    return Array(paragraphs).fill(tech).join('\n\n');
  };

  const generateBusiness = (length) => {
    const business = "Our company is committed to delivering exceptional value to our stakeholders. Through innovative solutions and strategic partnerships, we drive sustainable growth. Our team of experts ensures quality and efficiency in all operations.";
    const paragraphs = Math.max(1, Math.floor(length / 100));
    return Array(paragraphs).fill(business).join('\n\n');
  };

  const generateCreative = (length) => {
    const creative = "The sun dipped below the horizon, painting the sky in hues of orange and purple. A gentle breeze carried the scent of blooming flowers through the air. The world seemed to pause, caught in a moment of perfect tranquility.";
    const paragraphs = Math.max(1, Math.floor(length / 100));
    return Array(paragraphs).fill(creative).join('\n\n');
  };

  const generateAcademic = (length) => {
    const academic = "This study examines the correlation between various factors and their impact on the observed phenomena. Previous research has established a foundation for understanding these relationships. Our methodology follows established protocols for data collection and analysis.";
    const paragraphs = Math.max(1, Math.floor(length / 100));
    return Array(paragraphs).fill(academic).join('\n\n');
  };

  const generateLegal = (length) => {
    const legal = "The parties hereto agree to the following terms and conditions. All provisions herein shall be binding and enforceable under applicable law. Any disputes arising from this agreement shall be resolved through arbitration.";
    const paragraphs = Math.max(1, Math.floor(length / 100));
    return Array(paragraphs).fill(legal).join('\n\n');
  };

  const generateMedical = (length) => {
    const medical = "The patient presented with symptoms consistent with the described condition. Diagnostic tests revealed specific markers indicating the presence of the disease. Treatment protocols were implemented following established medical guidelines.";
    const paragraphs = Math.max(1, Math.floor(length / 100));
    return Array(paragraphs).fill(medical).join('\n\n');
  };

  const processText = () => {
    try {
      setError(null);
      
      let targetLength = 500; // Default medium length
      if (options.length === 'short') {
        targetLength = 200;
      } else if (options.length === 'long') {
        targetLength = 1000;
      }

      let generatedText = '';
      switch (options.template) {
        case 'lorem':
          generatedText = generateLoremIpsum(targetLength);
          break;
        case 'tech':
          generatedText = generateTechnical(targetLength);
          break;
        case 'business':
          generatedText = generateBusiness(targetLength);
          break;
        case 'creative':
          generatedText = generateCreative(targetLength);
          break;
        case 'academic':
          generatedText = generateAcademic(targetLength);
          break;
        case 'legal':
          generatedText = generateLegal(targetLength);
          break;
        case 'medical':
          generatedText = generateMedical(targetLength);
          break;
        default:
          generatedText = generateLoremIpsum(targetLength);
      }

      if (options.format === 'bullets') {
        generatedText = generatedText.split('. ').map(sentence => `• ${sentence}`).join('\n');
      } else if (options.format === 'numbered') {
        generatedText = generatedText.split('. ').map((sentence, index) => `${index + 1}. ${sentence}`).join('\n');
      } else if (options.format === 'mixed') {
        const sentences = generatedText.split('. ');
        const bulletCount = Math.floor(sentences.length / 2);
        generatedText = sentences.map((sentence, index) => 
          index < bulletCount ? `• ${sentence}` : `${index - bulletCount + 1}. ${sentence}`
        ).join('\n');
      }

      setResult(generatedText);

      if (showHistory) {
        const entry = {
          template: options.template,
          length: options.length,
          style: options.style,
          format: options.format,
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Error generating text. Please try again.');
      console.error('Generation error:', err);
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
            disabled={processing}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5 mr-2" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Template
            </h3>
            <div className="space-y-2">
              {templates.map(template => (
                <label key={template.id} className="flex items-start">
                  <input
                    type="radio"
                    checked={options.template === template.id}
                    onChange={() => setOptions({ ...options, template: template.id })}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{template.label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{template.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Length
            </h3>
            <div className="space-y-2">
              {lengths.map(length => (
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Style
            </h3>
            <div className="space-y-2">
              {styles.map(style => (
                <label key={style.id} className="flex items-start">
                  <input
                    type="radio"
                    checked={options.style === style.id}
                    onChange={() => setOptions({ ...options, style: style.id })}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{style.label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{style.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Format
            </h3>
            <div className="space-y-2">
              {formats.map(format => (
                <label key={format.id} className="flex items-start">
                  <input
                    type="radio"
                    checked={options.format === format.id}
                    onChange={() => setOptions({ ...options, format: format.id })}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{format.label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{format.description}</p>
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
              checked={options.includeNumbers}
              onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Numbers</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.includeSpecialChars}
              onChange={(e) => setOptions({ ...options, includeSpecialChars: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include Special Characters</span>
          </label>
        </div>

        {result && (
          <div className="space-y-4">
            <div>
              <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Generated Text
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
            Recent Generations
          </h3>
          <div className="mt-2 space-y-2">
            {history.map((entry, index) => (
              <div
                key={index}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <div className="text-sm text-gray-900 dark:text-white">
                  {templates.find(t => t.id === entry.template)?.label} • {entry.length} • {entry.style}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Format: {entry.format}
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

export default TextGenerator; 