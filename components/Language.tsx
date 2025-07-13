'use client';

import React, { useState } from 'react';

const LanguageInput = () => {
  const [language, setLanguage] = useState<'en' | 'hi' | 'es'>('en');

  return (
      <div className="flex items-center">
        <select
          value={language}  
          onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'pun')}
        >
          <option value="en">EN</option>
          <option value="hi">HI</option>
          <option value="pun">PUN</option>  
        </select>
      </div>
  );
};

export default LanguageInput;
