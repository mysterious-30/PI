import React, { useState, useEffect } from 'react';
import { 
  ArrowsRightLeftIcon, 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline';

const UnitConverter = ({ 
  onProcess, 
  processing = false,
  initialCategory = 'length',
  initialValue = '',
  showHistory = true
}) => {
  const [category, setCategory] = useState(initialCategory);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState(initialValue);
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [showCopied, setShowCopied] = useState(false);

  const categories = {
    length: {
      name: 'Length',
      units: {
        meter: { name: 'Meter (m)', factor: 1 },
        kilometer: { name: 'Kilometer (km)', factor: 1000 },
        centimeter: { name: 'Centimeter (cm)', factor: 0.01 },
        millimeter: { name: 'Millimeter (mm)', factor: 0.001 },
        inch: { name: 'Inch (in)', factor: 0.0254 },
        foot: { name: 'Foot (ft)', factor: 0.3048 },
        yard: { name: 'Yard (yd)', factor: 0.9144 },
        mile: { name: 'Mile (mi)', factor: 1609.344 }
      }
    },
    weight: {
      name: 'Weight',
      units: {
        kilogram: { name: 'Kilogram (kg)', factor: 1 },
        gram: { name: 'Gram (g)', factor: 0.001 },
        milligram: { name: 'Milligram (mg)', factor: 0.000001 },
        pound: { name: 'Pound (lb)', factor: 0.453592 },
        ounce: { name: 'Ounce (oz)', factor: 0.0283495 },
        ton: { name: 'Ton (t)', factor: 1000 }
      }
    },
    temperature: {
      name: 'Temperature',
      units: {
        celsius: { name: 'Celsius (°C)', factor: 1, offset: 0 },
        fahrenheit: { name: 'Fahrenheit (°F)', factor: 5/9, offset: -32 },
        kelvin: { name: 'Kelvin (K)', factor: 1, offset: -273.15 }
      }
    },
    area: {
      name: 'Area',
      units: {
        squareMeter: { name: 'Square Meter (m²)', factor: 1 },
        squareKilometer: { name: 'Square Kilometer (km²)', factor: 1000000 },
        squareCentimeter: { name: 'Square Centimeter (cm²)', factor: 0.0001 },
        squareMillimeter: { name: 'Square Millimeter (mm²)', factor: 0.000001 },
        squareInch: { name: 'Square Inch (in²)', factor: 0.00064516 },
        squareFoot: { name: 'Square Foot (ft²)', factor: 0.092903 },
        squareYard: { name: 'Square Yard (yd²)', factor: 0.836127 },
        squareMile: { name: 'Square Mile (mi²)', factor: 2589988.11 },
        acre: { name: 'Acre (ac)', factor: 4046.86 },
        hectare: { name: 'Hectare (ha)', factor: 10000 }
      }
    },
    volume: {
      name: 'Volume',
      units: {
        liter: { name: 'Liter (L)', factor: 1 },
        milliliter: { name: 'Milliliter (mL)', factor: 0.001 },
        cubicMeter: { name: 'Cubic Meter (m³)', factor: 1000 },
        cubicCentimeter: { name: 'Cubic Centimeter (cm³)', factor: 0.001 },
        cubicInch: { name: 'Cubic Inch (in³)', factor: 0.0163871 },
        cubicFoot: { name: 'Cubic Foot (ft³)', factor: 28.3168 },
        gallon: { name: 'Gallon (gal)', factor: 3.78541 },
        quart: { name: 'Quart (qt)', factor: 0.946353 },
        pint: { name: 'Pint (pt)', factor: 0.473176 },
        cup: { name: 'Cup (cup)', factor: 0.236588 },
        fluidOunce: { name: 'Fluid Ounce (fl oz)', factor: 0.0295735 }
      }
    }
  };

  useEffect(() => {
    if (category && !fromUnit) {
      const units = Object.keys(categories[category].units);
      setFromUnit(units[0]);
      setToUnit(units[1] || units[0]);
    }
  }, [category]);

  useEffect(() => {
    if (value && fromUnit && toUnit) {
      convert();
    }
  }, [value, fromUnit, toUnit, category]);

  const handleClear = () => {
    setValue('');
    setResult('');
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
        category,
        fromUnit,
        toUnit,
        value,
        result
      });
    }
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const convert = () => {
    if (category === 'temperature') {
      convertTemperature();
    } else {
      convertStandard();
    }
  };

  const convertStandard = () => {
    const fromFactor = categories[category].units[fromUnit].factor;
    const toFactor = categories[category].units[toUnit].factor;
    const convertedValue = (parseFloat(value) * fromFactor) / toFactor;
    setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ''));
  };

  const convertTemperature = () => {
    let convertedValue;
    const fromUnitData = categories.temperature.units[fromUnit];
    const toUnitData = categories.temperature.units[toUnit];
    const valueInCelsius = (parseFloat(value) - fromUnitData.offset) / fromUnitData.factor;
    
    if (toUnit === 'celsius') {
      convertedValue = valueInCelsius;
    } else if (toUnit === 'fahrenheit') {
      convertedValue = (valueInCelsius * 9/5) + 32;
    } else if (toUnit === 'kelvin') {
      convertedValue = valueInCelsius + 273.15;
    }
    
    setResult(convertedValue.toFixed(2));
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
          disabled={processing || !value || !fromUnit || !toUnit}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              Converting...
            </>
          ) : (
            'Convert'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {Object.entries(categories).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Value
          </label>
          <input
            type="number"
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter value"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fromUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            From
          </label>
          <select
            id="fromUnit"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {fromUnit && Object.entries(categories[category].units).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSwap}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowsRightLeftIcon className="h-5 w-5" />
          </button>
        </div>

        <div>
          <label htmlFor="toUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            To
          </label>
          <select
            id="toUnit"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {toUnit && Object.entries(categories[category].units).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="mt-4 p-4 rounded-md border border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Result
            </h3>
            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ClipboardIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 text-lg font-mono text-gray-900 dark:text-white">
            {result} {categories[category].units[toUnit].name}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitConverter; 