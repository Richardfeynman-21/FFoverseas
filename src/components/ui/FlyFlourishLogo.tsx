import React from 'react';
import { useLogoData } from '../../hooks/useLogoData';

interface FlyFlourishLogoProps {
  className?: string;
  showGlobeBg?: boolean;
  size?: number | string;
  iconOnly?: boolean;
}

export default function FlyFlourishLogo({
  className = '',
  showGlobeBg = true,
  size = '100%',
  iconOnly = false
}: FlyFlourishLogoProps) {
  const { data: logoPaths } = useLogoData();

  if (!logoPaths) return <div style={{ width: typeof size === 'number' ? size : size, aspectRatio: '1' }} />;
  // Center and scale calculations:
  // - With text (iconOnly = false): active content bounds [114, 208] to [518, 548] (height 340px).
  //   Scale by 1.12x and translate by (-53.92, -123.52) to center it in the 600x600 space.
  // - Monogram only (iconOnly = true): active monogram bounds [158, 208] to [495.8, 393].
  //   Scale by 1.5x and translate by (-190.35, -150.75) to center it.
  const transformStr = iconOnly 
    ? "translate(-190.35, -150.75) scale(1.5)" 
    : "translate(-53.92, -123.52) scale(1.12)";

  // Globe backdrop translation:
  // - With text: globe is centered at cy = 230 (slightly elevated behind monogram).
  // - Monogram only: translate globe down by 70px so center cy = 300 matches the monogram.
  const globeTransformStr = iconOnly
    ? "translate(0, 70) scale(2)"
    : "scale(2)";

  return (
    <svg
      viewBox="0 0 600 600"
      width={size}
      height={size}
      className={`select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. GLOBE BACKGROUND WATERMARK (Scaled 2x and aligned) */}
      {showGlobeBg && (
        <g id="globe-backdrop" className="opacity-80" transform={globeTransformStr}>
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
          <path d="M 40,115 L 260,115" stroke="rgba(0, 31, 63, 0.08)" strokeWidth="1" />
          <path d="M 55,80 Q 150,105 245,80" stroke="rgba(0, 31, 63, 0.06)" strokeWidth="1" fill="none" />
          <path d="M 55,150 Q 150,125 245,150" stroke="rgba(0, 31, 63, 0.06)" strokeWidth="1" fill="none" />
          <path d="M 80,50 Q 150,70 220,50" stroke="rgba(0, 31, 63, 0.05)" strokeWidth="1" fill="none" />
          <path d="M 80,180 Q 150,160 220,180" stroke="rgba(0, 31, 63, 0.05)" strokeWidth="1" fill="none" />

          {/* Longitude Lines */}
          <path d="M 150,5 L 150,225" stroke="rgba(0, 31, 63, 0.08)" strokeWidth="1" />
          <path d="M 90,20 Q 130,115 90,210" stroke="rgba(0, 31, 63, 0.05)" strokeWidth="1" fill="none" />
          <path d="M 210,20 Q 170,115 210,210" stroke="rgba(0, 31, 63, 0.05)" strokeWidth="1" fill="none" />

          {/* Faint pastel landmass shapes */}
          {/* North America */}
          <path
            d="M 60,75 C 65,65 80,55 95,50 C 110,45 130,35 140,55 C 135,70 120,70 120,80 C 120,90 145,95 135,115 C 125,125 110,135 110,145 C 95,145 90,130 80,135 C 75,120 58,110 55,95 Z"
            fill="#86EFAC"
            opacity="0.14"
          />
          {/* South America */}
          <path
            d="M 110,145 C 120,145 135,140 140,150 C 145,160 160,175 160,185 C 158,195 145,215 135,220 C 130,210 120,195 120,185 C 115,180 108,165 110,145 Z"
            fill="#FECACA"
            opacity="0.16"
          />
          {/* Greenland */}
          <path
            d="M 125,25 C 135,20 155,20 160,35 C 150,45 135,45 125,35 Z"
            fill="#BFDBFE"
            opacity="0.14"
          />
          {/* Europe / Asia */}
          <path
            d="M 175,40 C 185,35 205,30 220,40 C 235,50 250,55 255,70 C 245,85 230,85 220,100 C 205,95 195,105 190,95 C 180,95 170,80 175,65 Z"
            fill="#FEF08A"
            opacity="0.14"
          />
          {/* Africa */}
          <path
            d="M 175,100 C 190,105 210,105 215,120 C 215,140 205,175 190,185 C 185,185 175,170 170,160 C 165,140 168,125 175,100 Z"
            fill="#FED7AA"
            opacity="0.15"
          />
        </g>
      )}

      {/* 2. MAIN LOGO VECTORS (Clipped & scaled to fill canvas) */}
      <g clipPath="url(#clip0_0_1)">
        <g transform={transformStr}>
          <path d={logoPaths.f1} fill="#001F3F" stroke="#001F3F" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
          <path d={logoPaths.f2} fill="#001F3F" stroke="#001F3F" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />

          {/* Interlocking Connecting Patches / Spokes */}
          <path d="M219 298L171 288H219V298Z" fill="#001F3F" stroke="#001F3F" strokeWidth="0.5" />
          <path d="M353 299L316 296H353V299Z" fill="#001F3F" />
          <path d="M353 291L316 296H353V291Z" fill="#001F3F" />
          <path d="M252 330C255.5 330 218.5 335 218.5 335H198V330H252Z" fill="#001F3F" />
          <path d="M368 310C353.6 317.8 338 319.75 332 319.75V323H353C354.833 322.278 360.4 318.667 368 310Z" fill="#001F3F" />
          
          {/* Red Swoosh (Opaque and flat, legacy SVG filter removed to avoid clipping bounds issues) */}
          <path d={logoPaths.swoosh} fill="#FF0000" />
          
          {/* Jet Airplane */}
          <path d={logoPaths.plane} fill="#001F3F" />
          
          {/* Graduation cap (No clip-path is applied to prevent scaling coordinates drift) */}
          <path d={logoPaths.cap} fill="#001F3F" />
          
          {/* Logo Text and Taglines (hidden when iconOnly = true) */}
          {!iconOnly && (
            <>
              {/* Fly & Flourish Primary Brand Name */}
              <path d={logoPaths.fly} fill="#001F3F" />

              {/* Line Divider */}
              <line x1="121.997" y1="481" x2="516.997" y2="480" stroke="#001F3F" strokeWidth="2.5" />

              {/* Tagline: Overseas Consultants */}
              <path d={logoPaths.overseas} fill="#001F3F" />

              {/* Tagline Slogan: Study at your dream destination */}
              <path d={logoPaths.tagline} fill="#4B5563" />
            </>
          )}
        </g>
      </g>
      
      {/* 3. DEFINITIONS */}
      <defs>
        {/* Soft radial glass backplate gradient for globe hydration */}
        <radialGradient id="globe-grad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#F9FAFB" />
          <stop offset="100%" stopColor="#F3F4F6" />
        </radialGradient>
        
        <clipPath id="clip0_0_1">
          <rect width="600" height="600" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
