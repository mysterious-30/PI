import React, { useState, useRef, useEffect } from 'react';
import { 
  QrCodeIcon,
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DownloadIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ 
  onProcess, 
  processing = false,
  initialContent = '',
  defaultSize = 256,
  defaultErrorCorrection = 'M',
  showDownload = true
}) => {
  const [content, setContent] = useState(initialContent);
  const [size, setSize] = useState(defaultSize);
  const [errorCorrection, setErrorCorrection] = useState(defaultErrorCorrection);
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#FFFFFF');
  const [margin, setMargin] = useState(4);
  const [showPreview, setShowPreview] = useState(true);
  const [qrCodeData, setQrCodeData] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const canvasRef = useRef(null);

  const errorCorrectionLevels = [
    { value: 'L', label: 'Low (7%)' },
    { value: 'M', label: 'Medium (15%)' },
    { value: 'Q', label: 'Quartile (25%)' },
    { value: 'H', label: 'High (30%)' }
  ];

  useEffect(() => {
    if (content) {
      generateQRCode();
    }
  }, [content, size, errorCorrection, foreground, background, margin]);

  const handleClear = () => {
    setContent('');
    setSize(defaultSize);
    setErrorCorrection(defaultErrorCorrection);
    setForeground('#000000');
    setBackground('#FFFFFF');
    setMargin(4);
    setQrCodeData('');
  };

  const handleCopy = async () => {
    if (qrCodeData) {
      try {
        await navigator.clipboard.writeText(qrCodeData);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy QR code data:', err);
      }
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const handleProcess = () => {
    if (onProcess) {
      onProcess({
        content,
        size,
        errorCorrection,
        foreground,
        background,
        margin,
        qrCodeData
      });
    } else {
      generateQRCode();
    }
  };

  const generateQRCode = async () => {
    try {
      const options = {
        errorCorrectionLevel: errorCorrection,
        margin: margin,
        color: {
          dark: foreground,
          light: background
        },
        width: size
      };

      const dataUrl = await QRCode.toDataURL(content, options);
      setQrCodeData(dataUrl);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
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
          disabled={processing || !content}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              Generating...
            </>
          ) : (
            'Generate'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter text, URL, or data to encode"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Size: {size}px
            </label>
            <input
              type="range"
              id="size"
              min="100"
              max="1000"
              step="10"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label htmlFor="errorCorrection" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Error Correction
            </label>
            <select
              id="errorCorrection"
              value={errorCorrection}
              onChange={(e) => setErrorCorrection(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {errorCorrectionLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="foreground" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Foreground Color
          </label>
          <div className="mt-1 flex items-center space-x-2">
            <input
              type="color"
              id="foreground"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="background" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Background Color
          </label>
          <div className="mt-1 flex items-center space-x-2">
            <input
              type="color"
              id="background"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="margin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Margin: {margin}px
        </label>
        <input
          type="range"
          id="margin"
          min="0"
          max="10"
          step="1"
          value={margin}
          onChange={(e) => setMargin(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      {qrCodeData && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              QR Code Preview
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showPreview ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {showDownload && (
                <button
                  onClick={handleDownload}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <DownloadIcon className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={handleCopy}
                className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ClipboardIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-2 flex justify-center">
            {showPreview && (
              <img
                ref={canvasRef}
                src={qrCodeData}
                alt="QR Code"
                className="max-w-full h-auto"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator; 