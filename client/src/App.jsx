import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage';

// Import all tool components
import TimeZoneConverter from './components/tools/TimeZoneConverter';
import BaseConverter from './components/tools/BaseConverter';
import CurrencyConverter from './components/tools/CurrencyConverter';
import UnitConverter from './components/tools/UnitConverter';
import ColorPicker from './components/tools/ColorPicker';
import QRCodeGenerator from './components/tools/QRCodeGenerator';
import PasswordGenerator from './components/tools/PasswordGenerator';
import DateCalculator from './components/tools/DateCalculator';
import Calculator from './components/tools/Calculator';
import DataVisualizer from './components/tools/DataVisualizer';
import CodeEditor from './components/tools/CodeEditor';
import FileConverter from './components/tools/FileConverter';
import ImageEditor from './components/tools/ImageEditor';
import TextEditor from './components/tools/TextEditor';
import TextFormatter from './components/tools/TextFormatter';
import TextAnalyzer from './components/tools/TextAnalyzer';
import TextDiff from './components/tools/TextDiff';
import TextEncoder from './components/tools/TextEncoder';
import TextCaseConverter from './components/tools/TextCaseConverter';
import TextExtractor from './components/tools/TextExtractor';
import TextReplacer from './components/tools/TextReplacer';
import TextSorter from './components/tools/TextSorter';
import TextSplitter from './components/tools/TextSplitter';
import TextMerger from './components/tools/TextMerger';
import TextCounter from './components/tools/TextCounter';
import TextValidator from './components/tools/TextValidator';
import TextCompressor from './components/tools/TextCompressor';
import TextTranslator from './components/tools/TextTranslator';
import TextSummarizer from './components/tools/TextSummarizer';
import TextGenerator from './components/tools/TextGenerator';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Page Components
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import CategoryPage from './pages/CategoryPage';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const App = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    
                    {/* Converter Routes */}
                    <Route path="/timezone-converter" element={<TimeZoneConverter />} />
                    <Route path="/base-converter" element={<BaseConverter />} />
                    <Route path="/currency-converter" element={<CurrencyConverter />} />
                    <Route path="/unit-converter" element={<UnitConverter />} />
                    
                    {/* Generator Routes */}
                    <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
                    <Route path="/password-generator" element={<PasswordGenerator />} />
                    <Route path="/color-picker" element={<ColorPicker />} />
                    
                    {/* Calculator Routes */}
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/date-calculator" element={<DateCalculator />} />
                    
                    {/* Editor Routes */}
                    <Route path="/code-editor" element={<CodeEditor />} />
                    <Route path="/image-editor" element={<ImageEditor />} />
                    <Route path="/text-editor" element={<TextEditor />} />
                    <Route path="/file-converter" element={<FileConverter />} />
                    
                    {/* Visualization Routes */}
                    <Route path="/data-visualizer" element={<DataVisualizer />} />
                    
                    {/* Text Tool Routes */}
                    <Route path="/text-formatter" element={<TextFormatter />} />
                    <Route path="/text-analyzer" element={<TextAnalyzer />} />
                    <Route path="/text-diff" element={<TextDiff />} />
                    <Route path="/text-encoder" element={<TextEncoder />} />
                    <Route path="/text-case-converter" element={<TextCaseConverter />} />
                    <Route path="/text-extractor" element={<TextExtractor />} />
                    <Route path="/text-replacer" element={<TextReplacer />} />
                    <Route path="/text-sorter" element={<TextSorter />} />
                    <Route path="/text-splitter" element={<TextSplitter />} />
                    <Route path="/text-merger" element={<TextMerger />} />
                    <Route path="/text-counter" element={<TextCounter />} />
                    <Route path="/text-validator" element={<TextValidator />} />
                    <Route path="/text-compressor" element={<TextCompressor />} />
                    <Route path="/text-translator" element={<TextTranslator />} />
                    <Route path="/text-summarizer" element={<TextSummarizer />} />
                    <Route path="/text-generator" element={<TextGenerator />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </ThemeProvider>
        </I18nextProvider>
      </HelmetProvider>
    </Provider>
  );
};

export default App; 