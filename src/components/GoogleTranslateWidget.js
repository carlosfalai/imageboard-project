import React, { useState } from 'react';
import './GoogleTranslateWidget.css';

const GoogleTranslateWidget = () => {
  const [language, setLanguage] = useState('en');
  
  // Languages supported by Google Translate
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' }
  ];
  
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // In a real implementation, this would trigger the Google Translate API
    console.log(`Changing language to: ${newLanguage}`);
    
    // Mock implementation - in a real app, this would use the Google Translate API
    document.documentElement.lang = newLanguage;
  };
  
  return (
    <div className="translate-widget">
      <div className="translate-icon">🌐</div>
      <select 
        value={language}
        onChange={handleLanguageChange}
        className="language-selector"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GoogleTranslateWidget;
