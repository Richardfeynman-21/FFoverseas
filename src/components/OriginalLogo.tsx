import React from 'react';

interface OriginalLogoProps {
  className?: string;
  showText?: boolean;
  showGlobeBg?: boolean;
  size?: number | string;
  iconOnly?: boolean;
}

export default function OriginalLogo({
  className = '',
  showText = true,
  showGlobeBg = true,
  size = '100%',
  iconOnly = false
}: OriginalLogoProps) {
  return (
    <svg
      viewBox="0 0 300 300"
      width={size}
      height={size}
      className={`select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. GLOBE BACKGROUND WATERMARK (Faint lines and pastel continent blocks) */}
      {showGlobeBg && !iconOnly && (
        <g id="globe-backdrop" className="opacity-80">
          {/* Main sphere backplate */}
          <circle
            cx="150"
            cy="115"
            r="110"
            fill="url(#globe-grad)"
            stroke="rgba(0, 31, 63, 0.1)"
            strokeWidth="1.5"
            className="drop-shadow-sm"
          />

          {/* Latitude Lines */}
          <path
            d="M 40,115 L 260,115"
            stroke="rgba(0, 31, 63, 0.08)"
            strokeWidth="1"
          />
          <path
            d="M 55,80 Q 150,105 245,80"
            stroke="rgba(0, 31, 63, 0.06)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 55,150 Q 150,125 245,150"
            stroke="rgba(0, 31, 63, 0.06)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 80,50 Q 150,70 220,50"
            stroke="rgba(0, 31, 63, 0.05)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 80,180 Q 150,160 220,180"
            stroke="rgba(0, 31, 63, 0.05)"
            strokeWidth="1"
            fill="none"
          />

          {/* Longitude Lines */}
          <path
            d="M 150,5 L 150,225"
            stroke="rgba(0, 31, 63, 0.08)"
            strokeWidth="1"
          />
          <path
            d="M 90,20 Q 130,115 90,210"
            stroke="rgba(0, 31, 63, 0.05)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 210,20 Q 170,115 210,210"
            stroke="rgba(0, 31, 63, 0.05)"
            strokeWidth="1"
            fill="none"
          />

          {/* Faint pastel landmass shapes (North/South America on left, Europe/Africa on right) */}
          {/* North America in pastel green */}
          <path
            d="M 60,75 C 65,65 80,55 95,50 C 110,45 130,35 140,55 C 135,70 120,70 120,80 C 120,90 145,95 135,115 C 125,125 110,135 110,145 C 95,145 90,130 80,135 C 75,120 58,110 55,95 Z"
            fill="#86EFAC"
            opacity="0.14"
          />
          {/* South America in pastel pink/red */}
          <path
            d="M 110,145 C 120,145 135,140 140,150 C 145,160 160,175 160,185 C 158,195 145,215 135,220 C 130,210 120,195 120,185 C 115,180 108,165 110,145 Z"
            fill="#FECACA"
            opacity="0.16"
          />
          {/* Greenland in pastel blue */}
          <path
            d="M 125,25 C 135,20 155,20 160,35 C 150,45 135,45 125,35 Z"
            fill="#BFDBFE"
            opacity="0.14"
          />
          {/* Europe / Asia in pastel yellow */}
          <path
            d="M 175,40 C 185,35 205,30 220,40 C 235,50 250,55 255,70 C 245,85 230,85 220,100 C 205,95 195,105 190,95 C 180,95 170,80 175,65 Z"
            fill="#FEF08A"
            opacity="0.14"
          />
          {/* Africa in orange-brown */}
          <path
            d="M 175,100 C 190,105 210,105 215,120 C 215,140 205,175 190,185 C 185,185 175,170 170,160 C 165,140 168,125 175,100 Z"
            fill="#FED7AA"
            opacity="0.15"
          />
        </g>
      )}

      {/* 2. THE MAIN "FF" MONOGRAM & EMBELLISHMENTS */}
      <g id="brand-emblem" transform={iconOnly ? "translate(0, 30) scale(1.0)" : ""}>
        
        {/* SERIF DOUBLE "F" */}
        {/* First 'F' */}
        <text
          x="112"
          y="142"
          fontFamily="'Playfair Display', 'Georgia', 'Times New Roman', serif"
          fontSize="98"
          fontWeight="900"
          fill="#001F3F"
          textAnchor="middle"
          className="tracking-tight"
        >
          F
        </text>

        {/* Second 'F' */}
        <text
          x="180"
          y="142"
          fontFamily="'Playfair Display', 'Georgia', 'Times New Roman', serif"
          fontSize="98"
          fontWeight="900"
          fill="#001F3F"
          textAnchor="middle"
          className="tracking-tight"
        >
          F
        </text>

        {/* ACADEMIC MORTARBOARD CAP (On top-left of the first F) */}
        {/* Adjusted coordinates to match upper left foot-mount on the first F */}
        <g id="graduation-cap" transform="translate(62, 36)">
          {/* Cap Base under */}
          <path 
            d="M 11,18 Q 23,24 35,18 L 35,23 Q 23,29 11,23 Z" 
            fill="#111111" 
          />
          {/* Cap Mortarboard Diamond */}
          <polygon 
            points="23,9 43,15 23,21 3,15" 
            fill="#111111" 
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />
          {/* Tassel */}
          <path 
            d="M 23,15 Q 36,17 38,24 L 38,28" 
            stroke="#111111" 
            strokeWidth="1.2" 
            strokeLinecap="round"
            fill="none" 
          />
          {/* Little button on top center */}
          <circle cx="23" cy="15" r="1.5" fill="#111111" />
        </g>

        {/* RED DYNAMIC SWOOSH (Arcing left-to-right across the legs of middle FF) */}
        <path
          d="M 64,113 C 105,124 165,134 240,105 C 170,123 110,119 64,113 Z"
          fill="#FF0000"
          className="drop-shadow-xs"
        />

        {/* JET AIRPLANE SILHOUETTE (Flying Upwards-Right at the end of the swoosh) */}
        <g transform="translate(242, 103) rotate(42) scale(0.9)">
          <path
            d="M 0,-8 C 0.8,-4 1.2,0 1.2,2 L 8,3 C 8.5,3.2 8.5,3.8 8,4 L 1.2,3 L 1.2,6.5 L 3.5,8 L 3.5,9 L 0,8.2 L -3.5,9 L -3.5,8 L -1.2,6.5 L -1.2,3 L -8,4 C -8.5,3.8 -8.5,3.2 -8,3 L -1.2,2 C -1.2,0 -0.8,-4 0,-8 Z"
            fill="#111111"
          />
        </g>
      </g>

      {/* 3. LOGO TYPOGRAPHY & TAGLINES */}
      {showText && !iconOnly && (
        <g id="logo-texts">
          {/* Fly & Flourish Primary Text */}
          <text
            x="150"
            y="205"
            fontFamily="'Playfair Display', 'Georgia', 'Times New Roman', serif"
            fontSize="30"
            fontWeight="bold"
            fill="#001F3F"
            textAnchor="middle"
          >
            Fly & Flourish
          </text>

          {/* Elegant horizontal line division */}
          <line
            x1="52"
            y1="221"
            x2="248"
            y2="221"
            stroke="#001F3F"
            strokeWidth="1.8"
          />

          {/* Secondary Subheading text */}
          <text
            x="150"
            y="240"
            fontFamily="'Space Grotesk', 'Outfit', sans-serif"
            fontSize="15"
            fontWeight="bold"
            fill="#001F3F"
            textAnchor="middle"
            letterSpacing="1"
          >
            Overseas consultants
          </text>

          {/* Micro Slogan tagline */}
          <text
            x="150"
            y="266"
            fontFamily="'Outfit', sans-serif"
            fontSize="11.5"
            fontWeight="500"
            fill="#4B5563"
            textAnchor="middle"
            letterSpacing="0.3"
          >
            Study at your dream destination
          </text>
        </g>
      )}

      {/* Defining gradients */}
      <defs>
        {/* Soft radial glass backplate gradient for globe hydration */}
        <radialGradient id="globe-grad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#F9FAFB" />
          <stop offset="100%" stopColor="#F3F4F6" />
        </radialGradient>
      </defs>
    </svg>
  );
}
