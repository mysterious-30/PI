import React, { useState, useRef } from 'react';
import { 
  TableCellsIcon, 
  ChartBarIcon, 
  TrashIcon, 
  ArrowPathIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const DataVisualizer = ({ 
  onProcess, 
  processing = false,
  supportedFormats = ['json', 'csv', 'xml'],
  maxFileSize = 5 // in MB
}) => {
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [format, setFormat] = useState('');
  const [visualizationType, setVisualizationType] = useState('table');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File size exceeds the maximum limit of ${maxFileSize}MB`);
        return;
      }
      setData(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setData(null);
    setPreview(null);
    setFormat('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcess = () => {
    if (onProcess && data && format) {
      onProcess(data, format, visualizationType);
    }
  };

  const renderPreview = () => {
    if (!preview) return null;

    try {
      switch (format) {
        case 'json':
          const jsonData = JSON.parse(preview);
          return (
            <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          );
        case 'csv':
          return (
            <div className="overflow-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {preview.split('\n').map((row, i) => (
                    <tr key={i}>
                      {row.split(',').map((cell, j) => (
                        <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        case 'xml':
          return (
            <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
              {preview}
            </pre>
          );
        default:
          return null;
      }
    } catch (error) {
      return (
        <div className="text-red-500 dark:text-red-400">
          Error parsing data: {error.message}
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Upload Data
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            disabled={!data}
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Clear
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="format" className="sr-only">
              Data Format
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Format</option>
              {supportedFormats.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="visualization" className="sr-only">
              Visualization Type
            </label>
            <select
              id="visualization"
              value={visualizationType}
              onChange={(e) => setVisualizationType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="table">Table</option>
              <option value="chart">Chart</option>
              <option value="graph">Graph</option>
            </select>
          </div>
          <button
            onClick={handleProcess}
            disabled={!data || !format || processing}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                Processing...
              </>
            ) : (
              'Visualize'
            )}
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={supportedFormats.map(fmt => `.${fmt}`).join(',')}
        className="hidden"
      />

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
        {preview ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>File: {data.name}</p>
                <p>Size: {(data.size / 1024 / 1024).toFixed(2)} MB</p>
                <p>Type: {data.type}</p>
              </div>
              <button
                onClick={handleClear}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <TrashIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            {renderPreview()}
          </div>
        ) : (
          <div className="text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Drag and drop a data file here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Supports {supportedFormats.join(', ').toUpperCase()} up to {maxFileSize}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataVisualizer; 