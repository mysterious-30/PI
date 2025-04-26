import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalculatorIcon,
  ClockIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  PhotoIcon,
  QrCodeIcon,
  KeyIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  AdjustmentsHorizontalIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  RulerIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';

const tools = [
  {
    category: 'Text Tools',
    items: [
      { name: 'Text Formatter', path: '/text-formatter', icon: DocumentTextIcon },
      { name: 'Text Analyzer', path: '/text-analyzer', icon: DocumentTextIcon },
      { name: 'Text Diff', path: '/text-diff', icon: DocumentTextIcon },
      { name: 'Text Encoder', path: '/text-encoder', icon: DocumentTextIcon },
      { name: 'Text Case Converter', path: '/text-case-converter', icon: DocumentTextIcon },
      { name: 'Text Extractor', path: '/text-extractor', icon: DocumentTextIcon },
      { name: 'Text Replacer', path: '/text-replacer', icon: DocumentTextIcon },
      { name: 'Text Sorter', path: '/text-sorter', icon: DocumentTextIcon },
      { name: 'Text Splitter', path: '/text-splitter', icon: DocumentTextIcon },
      { name: 'Text Merger', path: '/text-merger', icon: DocumentTextIcon },
      { name: 'Text Counter', path: '/text-counter', icon: DocumentTextIcon },
      { name: 'Text Validator', path: '/text-validator', icon: DocumentTextIcon },
      { name: 'Text Compressor', path: '/text-compressor', icon: DocumentTextIcon },
      { name: 'Text Translator', path: '/text-translator', icon: DocumentTextIcon },
      { name: 'Text Summarizer', path: '/text-summarizer', icon: DocumentTextIcon },
      { name: 'Text Generator', path: '/text-generator', icon: DocumentTextIcon }
    ]
  },
  {
    category: 'Converters',
    items: [
      { name: 'Time Zone Converter', path: '/timezone-converter', icon: ClockIcon },
      { name: 'Base Converter', path: '/base-converter', icon: AdjustmentsHorizontalIcon },
      { name: 'Currency Converter', path: '/currency-converter', icon: CurrencyDollarIcon },
      { name: 'Unit Converter', path: '/unit-converter', icon: RulerIcon }
    ]
  },
  {
    category: 'Generators',
    items: [
      { name: 'QR Code Generator', path: '/qr-code-generator', icon: QrCodeIcon },
      { name: 'Password Generator', path: '/password-generator', icon: KeyIcon },
      { name: 'Color Picker', path: '/color-picker', icon: SwatchIcon }
    ]
  },
  {
    category: 'Calculators',
    items: [
      { name: 'Calculator', path: '/calculator', icon: CalculatorIcon },
      { name: 'Date Calculator', path: '/date-calculator', icon: CalendarIcon }
    ]
  },
  {
    category: 'Editors',
    items: [
      { name: 'Code Editor', path: '/code-editor', icon: CodeBracketIcon },
      { name: 'Image Editor', path: '/image-editor', icon: PhotoIcon },
      { name: 'Text Editor', path: '/text-editor', icon: DocumentDuplicateIcon },
      { name: 'File Converter', path: '/file-converter', icon: DocumentDuplicateIcon }
    ]
  },
  {
    category: 'Visualization',
    items: [
      { name: 'Data Visualizer', path: '/data-visualizer', icon: ChartBarIcon }
    ]
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Developer Tools
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A collection of useful tools for developers, writers, and anyone who works with text and data.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {tools.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.items.map((tool) => (
                  <Link
                    key={tool.name}
                    to={tool.path}
                    className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <tool.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {tool.name}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      Click to use this tool
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 