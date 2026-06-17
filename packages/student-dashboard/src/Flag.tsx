import React, { useState } from 'react';

// Helper to map country names, 3-letter codes, or emojis to 2-letter ISO codes
export function getCountryCode(input: string): string {
  if (!input) return '';
  const normalized = input.trim().toLowerCase();
  
  const mapping: Record<string, string> = {
    // USA
    'usa': 'us',
    'united states': 'us',
    'united states of america': 'us',
    '🇺🇸': 'us',
    
    // UK
    'uk': 'gb',
    'gbr': 'gb',
    'united kingdom': 'gb',
    'great britain': 'gb',
    '🇬🇧': 'gb',
    
    // Canada
    'canada': 'ca',
    'can': 'ca',
    '🇨🇦': 'ca',
    
    // Australia
    'australia': 'au',
    'aus': 'au',
    '🇦🇺': 'au',
    
    // Germany
    'germany': 'de',
    'deu': 'de',
    'deutschland': 'de',
    '🇩🇪': 'de',
    
    // France
    'france': 'fr',
    'fra': 'fr',
    '🇫🇷': 'fr',
    
    // Netherlands
    'netherlands': 'nl',
    'nld': 'nl',
    '🇳🇱': 'nl',
    
    // Ireland
    'ireland': 'ie',
    'irl': 'ie',
    '🇮🇪': 'ie',
  };

  if (mapping[normalized]) {
    return mapping[normalized];
  }
  
  if (normalized.length === 2) {
    return normalized;
  }
  
  return '';
}

interface FlagProps {
  country: string;
  className?: string;
}

export function Flag({ country, className = "w-5 h-3.5" }: FlagProps) {
  const code = getCountryCode(country);
  const [error, setError] = useState(false);

  if (!code || error) {
    // Elegant fallback text badge if the image fails or code is not recognized
    const text = (code || country).substring(0, 2).toUpperCase();
    return (
      <span 
        className={`inline-flex items-center justify-center bg-slate-100 text-[9px] font-bold text-slate-600 rounded border border-slate-200 uppercase select-none ${className}`}
        style={{ aspectRatio: '1.5/1' }}
      >
        {text}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={`${country} flag`}
      className={`inline-block object-cover rounded-[2px] border border-black/10 shadow-[0_1px_2px_rgba(0,0,0,0.05)] select-none ${className}`}
      style={{ aspectRatio: '1.5/1' }}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
