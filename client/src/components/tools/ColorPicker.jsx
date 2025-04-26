import React, { useState, useRef, useEffect } from 'react';
import { 
  EyeDropperIcon,
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';

const ColorPicker = ({ 
  onProcess, 
  processing = false,
  initialColor = '#000000',
  showAlpha = true,
  showPalette = true,
  showHistory = true
}) => {
  const [color, setColor] = useState(initialColor);
  const [alpha, setAlpha] = useState(100);
  const [format, setFormat] = useState('hex');
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const colorInputRef = useRef(null);

  const formats = [
    { value: 'hex', label: 'HEX' },
    { value: 'rgb', label: 'RGB' },
    { value: 'hsl', label: 'HSL' }
  ];

  const defaultPalette = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080',
    '#800000', '#808000', '#008000', '#800080', '#008080',
    '#000080'
  ];

  useEffect(() => {
    if (color && !history.includes(color)) {
      setHistory(prev => [color, ...prev].slice(0, 10));
    }
  }, [color]);

  const handleClear = () => {
    setColor(initialColor);
    setAlpha(100);
    setFormat('hex');
  };

  const handleCopy = async () => {
    try {
      let colorToCopy = color;
      if (format === 'rgb') {
        colorToCopy = hexToRgb(color);
      } else if (format === 'hsl') {
        colorToCopy = hexToHsl(color);
      }
      await navigator.clipboard.writeText(colorToCopy);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const handleProcess = () => {
    if (onProcess) {
      onProcess({
        color,
        alpha,
        format,
        rgb: hexToRgb(color),
        hsl: hexToHsl(color)
      });
    }
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleAlphaChange = (e) => {
    setAlpha(parseInt(e.target.value));
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const handlePaletteSelect = (paletteColor) => {
    setColor(paletteColor);
  };

  const handleHistorySelect = (historyColor) => {
    setColor(historyColor);
  };

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
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
          disabled={processing}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Color
          </label>
          <div className="mt-1 flex items-center space-x-2">
            <input
              type="color"
              id="color"
              value={color}
              onChange={handleColorChange}
              className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={handleColorChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ClipboardIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Format
            </label>
            <select
              id="format"
              value={format}
              onChange={handleFormatChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {formats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          {showAlpha && (
            <div>
              <label htmlFor="alpha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Alpha: {alpha}%
              </label>
              <input
                type="range"
                id="alpha"
                min="0"
                max="100"
                value={alpha}
                onChange={handleAlphaChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          )}
        </div>
      </div>

      {showPalette && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Color Palette
          </label>
          <div className="mt-2 grid grid-cols-8 gap-2">
            {defaultPalette.map((paletteColor) => (
              <button
                key={paletteColor}
                onClick={() => handlePaletteSelect(paletteColor)}
                className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
                style={{ backgroundColor: paletteColor }}
                title={paletteColor}
              />
            ))}
          </div>
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Colors
          </label>
          <div className="mt-2 grid grid-cols-8 gap-2">
            {history.map((historyColor) => (
              <button
                key={historyColor}
                onClick={() => handleHistorySelect(historyColor)}
                className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
                style={{ backgroundColor: historyColor }}
                title={historyColor}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 rounded-md border border-gray-300 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {format === 'hex' && color}
            {format === 'rgb' && hexToRgb(color)}
            {format === 'hsl' && hexToHsl(color)}
          </div>
        </div>
        <div
          className="mt-2 h-32 rounded-md"
          style={{
            backgroundColor: color,
            opacity: alpha / 100
          }}
        />
      </div>
    </div>
  );
};

export default ColorPicker; 