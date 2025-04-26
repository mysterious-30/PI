import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  LanguageIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const TextTranslator = ({ 
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
    sourceLanguage: 'auto',
    targetLanguage: 'en',
    preserveFormatting: true
  });

  const languages = [
    { id: 'auto', label: 'Auto-detect', nativeName: 'Auto-detect' },
    { id: 'en', label: 'English', nativeName: 'English' },
    { id: 'es', label: 'Spanish', nativeName: 'Español' },
    { id: 'fr', label: 'French', nativeName: 'Français' },
    { id: 'de', label: 'German', nativeName: 'Deutsch' },
    { id: 'it', label: 'Italian', nativeName: 'Italiano' },
    { id: 'pt', label: 'Portuguese', nativeName: 'Português' },
    { id: 'ru', label: 'Russian', nativeName: 'Русский' },
    { id: 'zh', label: 'Chinese', nativeName: '中文' },
    { id: 'ja', label: 'Japanese', nativeName: '日本語' },
    { id: 'ko', label: 'Korean', nativeName: '한국어' },
    { id: 'ar', label: 'Arabic', nativeName: 'العربية' },
    { id: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
    { id: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
    { id: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { id: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
    { id: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
    { id: 'mr', label: 'Marathi', nativeName: 'मराठी' },
    { id: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી' },
    { id: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { id: 'ml', label: 'Malayalam', nativeName: 'മലയാളം' },
    { id: 'or', label: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { id: 'as', label: 'Assamese', nativeName: 'অসমীয়া' },
    { id: 'ne', label: 'Nepali', nativeName: 'नेपाली' }
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

  const handleSwapLanguages = () => {
    if (options.sourceLanguage !== 'auto') {
      setOptions({
        ...options,
        sourceLanguage: options.targetLanguage,
        targetLanguage: options.sourceLanguage
      });
      if (result) {
        setValue(result);
        setResult(value);
      }
    }
  };

  const processText = () => {
    try {
      setError(null);
      
      if (!value) {
        setResult(null);
        return;
      }

      // Mock translation for demonstration
      // In a real app, you would use a translation API
      const mockTranslations = {
        'en': {
          'es': 'Hola, ¿cómo estás?',
          'fr': 'Bonjour, comment allez-vous?',
          'de': 'Hallo, wie geht es Ihnen?',
          'it': 'Ciao, come stai?',
          'pt': 'Olá, como você está?',
          'ru': 'Привет, как дела?',
          'zh': '你好，你好吗？',
          'ja': 'こんにちは、お元気ですか？',
          'ko': '안녕하세요, 어떻게 지내세요?',
          'ar': 'مرحباً، كيف حالك؟',
          'hi': 'नमस्ते, आप कैसे हैं?',
          'bn': 'হ্যালো, আপনি কেমন আছেন?',
          'pa': 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?',
          'ta': 'வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?',
          'te': 'హలో, మీరు ఎలా ఉన్నారు?',
          'mr': 'नमस्कार, तुम्ही कसे आहात?',
          'gu': 'નમસ્તે, તમે કેમ છો?',
          'kn': 'ಹಲೋ, ನೀವು ಹೇಗಿದ್ದೀರಿ?',
          'ml': 'ഹലോ, നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്?',
          'or': 'ନମସ୍କାର, ଆପଣ କେମିତି ଅଛନ୍ତି?',
          'as': 'নমস্কাৰ, আপুনি কেনেকৈ আছে?',
          'ne': 'नमस्कार, तपाईं कसरी हुनुहुन्छ?'
        }
      };

      let translatedText = value;
      if (options.sourceLanguage !== options.targetLanguage) {
        if (options.sourceLanguage === 'en' && mockTranslations['en'][options.targetLanguage]) {
          translatedText = mockTranslations['en'][options.targetLanguage];
        } else {
          translatedText = `[${languages.find(l => l.id === options.targetLanguage)?.nativeName} Translation] ${value}`;
        }
      }

      setResult(translatedText);

      if (showHistory) {
        const entry = {
          sourceLanguage: options.sourceLanguage,
          targetLanguage: options.targetLanguage,
          originalText: value,
          translatedText: translatedText,
          date: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 5));
      }
    } catch (err) {
      setError('Error translating text. Please try again.');
      console.error('Translation error:', err);
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
                Translating...
              </>
            ) : (
              <>
                <LanguageIcon className="h-5 w-5 mr-2" />
                Translate
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Source Text
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
                placeholder="Enter text to translate"
                rows={6}
              />
            </div>
          </div>

          {result && (
            <div>
              <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Translated Text
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
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Translation Options
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Source Language</label>
                <select
                  value={options.sourceLanguage}
                  onChange={(e) => setOptions({ ...options, sourceLanguage: e.target.value })}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {languages.map(language => (
                    <option key={language.id} value={language.id}>
                      {language.label} ({language.nativeName})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Target Language</label>
                <select
                  value={options.targetLanguage}
                  onChange={(e) => setOptions({ ...options, targetLanguage: e.target.value })}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {languages.filter(l => l.id !== 'auto').map(language => (
                    <option key={language.id} value={language.id}>
                      {language.label} ({language.nativeName})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSwapLanguages}
                  disabled={options.sourceLanguage === 'auto'}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-1" />
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={options.preserveFormatting}
                    onChange={(e) => setOptions({ ...options, preserveFormatting: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Preserve Formatting</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Language Information
            </h3>
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Source: {languages.find(l => l.id === options.sourceLanguage)?.nativeName}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                Target: {languages.find(l => l.id === options.targetLanguage)?.nativeName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-md bg-red-50 dark:bg-red-900">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Translations
          </h3>
          <div className="mt-2 space-y-2">
            {history.map((entry, index) => (
              <div
                key={index}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
              >
                <div className="text-sm text-gray-900 dark:text-white">
                  {languages.find(l => l.id === entry.sourceLanguage)?.label} → {languages.find(l => l.id === entry.targetLanguage)?.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.originalText.slice(0, 50)}...
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

export default TextTranslator; 