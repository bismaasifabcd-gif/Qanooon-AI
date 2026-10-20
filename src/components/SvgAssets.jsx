import React from 'react';

/**
 * Kanoon AI - Premium SVG Illustration Library
 * Designed by a Senior UI Designer.
 * Color Palette:
 * - Navy: #1B2A4A
 * - Gold: #C9A84C
 * - Green: #1A6B4A
 * - Cream: #F5F0E8
 */

// 1. Premium App Logo (Chiseled Gold Shield with Scales & Neural pillar)
export const KanoonLogo = ({ className = "w-16 h-16", ...props }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(201,168,76,0.6)]`}
    {...props}
  >
    <defs>
      <linearGradient id="logoReflectiveGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFEAA7" />
        <stop offset="25%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#AA7C11" />
        <stop offset="75%" stopColor="#F9D976" />
        <stop offset="100%" stopColor="#B38F1F" />
      </linearGradient>
      <linearGradient id="logoChiseledGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B38F1F" />
        <stop offset="30%" stopColor="#F9D976" />
        <stop offset="50%" stopColor="#AA7C11" />
        <stop offset="70%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#FFEAA7" />
      </linearGradient>
      <linearGradient id="logoShieldNavy" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1B2A4A" />
        <stop offset="100%" stopColor="#080D1A" />
      </linearGradient>
      <filter id="logoDepthShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#060913" floodOpacity="0.5" />
      </filter>
    </defs>
    
    {/* Outer Gold Shield Border */}
    <path
      d="M 60 14 C 70 12 85 12 95 18 C 99 37 95 62 89 77 C 82 95 68 111 60 115 C 52 111 38 95 31 77 C 25 62 21 37 25 18 C 35 12 50 12 60 14 Z"
      fill="url(#logoChiseledGold)"
      filter="url(#logoDepthShadow)"
    />

    {/* Inner Gold Shield Border */}
    <path
      d="M 60 19 C 69 17 82 17 91 22 C 94 39 91 60 85 73 C 79 89 67 103 60 107 C 53 103 41 89 35 73 C 29 60 26 39 29 22 C 38 17 51 17 60 19 Z"
      fill="url(#logoReflectiveGold)"
    />

    {/* Deep Navy Shield Field */}
    <path
      d="M 60 21 C 68 19 80 19 88 24 C 91 40 88 59 83 71 C 77 86 66 99 60 103 C 54 99 43 86 37 71 C 32 59 29 40 32 24 C 40 19 52 19 60 21 Z"
      fill="url(#logoShieldNavy)"
    />

    {/* Central Pillar of Law (Neural Circuit Grid) */}
    {/* Capital Horizontal plates */}
    <rect x="47" y="27" width="26" height="2.5" rx="1" fill="url(#logoReflectiveGold)" />
    <rect x="49" y="31.5" width="22" height="2.5" rx="1" fill="url(#logoReflectiveGold)" />
    <rect x="51" y="36" width="18" height="2.5" rx="1" fill="url(#logoReflectiveGold)" />
    
    {/* Pedestal Base plates */}
    <rect x="49" y="82" width="22" height="2.5" rx="1" fill="url(#logoReflectiveGold)" />
    <rect x="46" y="86.5" width="28" height="2.5" rx="1" fill="url(#logoReflectiveGold)" />
    <rect x="43" y="91" width="34" height="2.5" rx="1" fill="url(#logoReflectiveGold)" />

    {/* Scales Crossbar */}
    <path d="M 37 42.5 H 83" stroke="url(#logoReflectiveGold)" strokeWidth="2" strokeLinecap="round" />
    
    {/* Symmetric Scale Hangers */}
    <path d="M 37 42.5 L 28 65 H 46 Z" stroke="url(#logoReflectiveGold)" strokeWidth="0.8" fill="none" opacity="0.9" />
    <path d="M 83 42.5 L 74 65 H 92 Z" stroke="url(#logoReflectiveGold)" strokeWidth="0.8" fill="none" opacity="0.9" />
    
    {/* Scale Bowls */}
    <path d="M 27 65 C 27 73 47 73 47 65 Z" fill="url(#logoReflectiveGold)" stroke="url(#logoReflectiveGold)" strokeWidth="0.5" />
    <path d="M 73 65 C 73 73 93 73 93 65 Z" fill="url(#logoReflectiveGold)" stroke="url(#logoReflectiveGold)" strokeWidth="0.5" />

    {/* Neural Trunk (Pillar Shaft) */}
    <line x1="60" y1="38.5" x2="60" y2="82" stroke="url(#logoReflectiveGold)" strokeWidth="2.5" />
    
    {/* Neural Circuit traces flanking trunk */}
    <path d="M 55 38.5 V 66 L 49 72.5" stroke="url(#logoReflectiveGold)" strokeWidth="1.2" fill="none" />
    <path d="M 65 38.5 V 66 L 71 72.5" stroke="url(#logoReflectiveGold)" strokeWidth="1.2" fill="none" />
    
    {/* Neural Connection Nodes */}
    <circle cx="49" cy="72.5" r="1.5" fill="url(#logoReflectiveGold)" />
    <circle cx="71" cy="72.5" r="1.5" fill="url(#logoReflectiveGold)" />
    <circle cx="60" cy="38.5" r="2" fill="url(#logoReflectiveGold)" />
  </svg>
);

// 1b. Premium App Logo Full Layout (Vertical Shield + Metallic Urdu "قانون" + Gold "AI")
export const KanoonLogoFull = ({ className = "w-64 h-80", ...props }) => (
  <svg
    viewBox="0 0 200 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="fullGoldText" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFEAA7" />
        <stop offset="25%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#AA7C11" />
        <stop offset="75%" stopColor="#F9D976" />
        <stop offset="100%" stopColor="#B38F1F" />
      </linearGradient>
      <filter id="fullTextShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#060913" floodOpacity="0.8" />
      </filter>
    </defs>

    {/* Embossed Shield centered at top */}
    <g transform="translate(40, 10)">
      <KanoonLogo className="w-30 h-30" />
    </g>

    {/* Urdu metallic word "قانون" in premium Nastaliq styling */}
    <text
      x="100"
      y="180"
      fill="url(#fullGoldText)"
      fontFamily="'Jameel Noori', 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif"
      fontSize="42"
      fontWeight="bold"
      textAnchor="middle"
      filter="url(#fullTextShadow)"
    >
      قانون
    </text>

    {/* English "AI" typography */}
    <text
      x="100"
      y="225"
      fill="url(#fullGoldText)"
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="26"
      fontWeight="900"
      letterSpacing="2"
      textAnchor="middle"
      filter="url(#fullTextShadow)"
    >
      AI
    </text>
  </svg>
);

// 2. Splash Screen Hero (Pillar of Law standing with pulsing AI neural networks)
export const SplashHeroIllustration = ({ className = "w-64 h-64", ...props }) => (
  <svg
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="pillarGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C9A84C" />
        <stop offset="50%" stopColor="#E0C57A" />
        <stop offset="100%" stopColor="#9E7F31" />
      </linearGradient>
      <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#1A6B4A" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#1B2A4A" stopOpacity="0.2" />
      </linearGradient>
      <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Background glowing halo */}
    <circle cx="120" cy="120" r="85" fill="#C9A84C" fillOpacity="0.03" className="animate-pulse" />
    <circle cx="120" cy="120" r="65" fill="#1A6B4A" fillOpacity="0.03" />

    {/* Neural AI Circuit Lines (Background) */}
    <g stroke="url(#neuralGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
      <path d="M40 80C60 60 90 70 120 70" />
      <path d="M200 80C180 60 150 70 120 70" />
      <path d="M40 160C70 170 90 140 120 140" />
      <path d="M200 160C170 170 150 140 120 140" />
      
      {/* Connector lines to the column */}
      <path d="M80 110H100" />
      <path d="M160 110H140" />
      <path d="M90 130H105" />
      <path d="M150 130H135" />
    </g>

    {/* Neural Tech Nodes */}
    <g fill="#C9A84C">
      <circle cx="40" cy="80" r="4.5" className="animate-pulse" />
      <circle cx="200" cy="80" r="4.5" />
      <circle cx="80" cy="110" r="3.5" />
      <circle cx="160" cy="110" r="3.5" />
      <circle cx="90" cy="130" r="3.5" />
      <circle cx="150" cy="130" r="3.5" />
      <circle cx="40" cy="160" r="4.5" />
      <circle cx="200" cy="160" r="4.5" className="animate-pulse" />
    </g>

    {/* Majestic Pillar of Justice (Centered) */}
    {/* Base */}
    <rect x="75" y="175" width="90" height="15" rx="4" fill="url(#pillarGold)" />
    <rect x="85" y="163" width="70" height="12" rx="2" fill="url(#pillarGold)" />
    
    {/* Column Body */}
    <rect x="94" y="65" width="12" height="98" fill="url(#pillarGold)" />
    <rect x="114" y="65" width="12" height="98" fill="url(#pillarGold)" />
    <rect x="134" y="65" width="12" height="98" fill="url(#pillarGold)" />
    
    {/* Column Capital/Architrave */}
    <path d="M80 53H160V65H80V53Z" fill="url(#pillarGold)" />
    <path d="M75 42H165V50H75V42Z" fill="url(#pillarGold)" />
    
    {/* Triangular Pediment (Roof) representing Supreme Court Authority */}
    <polygon points="120,15 70,42 170,42" fill="url(#pillarGold)" />
    
    {/* Glowing Crescent & Star of Pakistan at the top center of the dome */}
    <path
      d="M123 23.5C122.1 23.5 121.2 23.7 120.5 24.2C121.5 24.4 122.2 25.3 122.2 26.4C122.2 27.5 121.5 28.4 120.5 28.6C121.2 29.1 122.1 29.3 123 29.3C124.6 29.3 125.9 28 125.9 26.4C125.9 24.8 124.6 23.5 123 23.5Z"
      fill="#F5F0E8"
      filter="url(#softGlow)"
    />
    <polygon points="126.5,23.5 127.5,25.5 129.5,25.5 128,26.5 128.5,28.5 126.5,27.5 124.5,28.5 125,26.5 123.5,25.5 125.5,25.5" fill="#F5F0E8" />
  </svg>
);

// 3. Auth Page Left Visual Panel (Crest containing Scales of Justice, Shield, and elegant leaves)
export const AuthVisualIllustration = ({ className = "w-full max-w-sm h-auto", ...props }) => (
  <svg
    viewBox="0 0 320 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="authGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0C57A" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
      <linearGradient id="authGreen" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#258E62" />
        <stop offset="100%" stopColor="#1A6B4A" />
      </linearGradient>
      <linearGradient id="authNavy" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2A3B5D" />
        <stop offset="100%" stopColor="#121D33" />
      </linearGradient>
    </defs>

    {/* Background Grid Pattern */}
    <g stroke="#C9A84C" strokeWidth="0.5" opacity="0.15">
      <circle cx="160" cy="160" r="140" strokeDasharray="4 4" />
      <circle cx="160" cy="160" r="100" />
      <line x1="20" y1="160" x2="300" y2="160" />
      <line x1="160" y1="20" x2="160" y2="300" />
    </g>

    {/* Abstract Premium Leaves / Olive Wreath (Symmetry representing peace and order) */}
    <g fill="url(#authGold)" opacity="0.8">
      {/* Left Leaf branch */}
      <path d="M90 230C80 200 80 160 100 120C105 135 105 155 98 175" />
      <path d="M80 180C65 170 60 150 70 135C75 145 78 160 80 180Z" />
      <path d="M85 140C75 130 70 110 80 95C85 105 88 120 85 140Z" />
      <path d="M95 105C88 95 85 75 95 60C100 70 100 85 95 105Z" />
      
      {/* Right Leaf branch */}
      <path d="M230 230C240 200 240 160 220 120C215 135 215 155 222 175" />
      <path d="M240 180C255 170 260 150 250 135C245 145 242 160 240 180Z" />
      <path d="M235 140C245 130 250 110 240 95C235 105 232 120 235 140Z" />
      <path d="M225 105C232 95 235 75 225 60C220 70 220 85 225 105Z" />
    </g>

    {/* Large Central Security Shield representing Legal Protection */}
    <path
      d="M160 50C205 50 240 62 240 102C240 162 195 218 160 240C125 218 80 162 80 102C80 62 115 50 160 50Z"
      fill="url(#authNavy)"
      stroke="url(#authGold)"
      strokeWidth="4"
    />
    
    {/* Inner Green shield showing national identity & safety */}
    <path
      d="M160 62C195 62 225 72 225 105C225 152 188 198 160 220C132 198 95 152 95 105C95 72 125 62 160 62Z"
      fill="url(#authGreen)"
      opacity="0.85"
    />

    {/* Premium detailed Scales of Justice inside the shield */}
    {/* Stand */}
    <rect x="156" y="85" width="8" height="105" rx="2" fill="url(#authGold)" />
    <path d="M135 190H185V200H135V190Z" fill="url(#authGold)" rx="2" />
    
    {/* Balance Beam */}
    <path d="M110 102H210V107H110V102Z" fill="url(#authGold)" />
    <circle cx="160" cy="104.5" r="5" fill="#F5F0E8" />
    
    {/* Left Plate */}
    <line x1="120" y1="105" x2="105" y2="135" stroke="url(#authGold)" strokeWidth="1.5" />
    <line x1="120" y1="105" x2="135" y2="135" stroke="url(#authGold)" strokeWidth="1.5" />
    <path d="M100 135C100 145 140 145 140 135H100Z" fill="url(#authGold)" />
    
    {/* Right Plate */}
    <line x1="200" y1="105" x2="185" y2="135" stroke="url(#authGold)" strokeWidth="1.5" />
    <line x1="200" y1="105" x2="215" y2="135" stroke="url(#authGold)" strokeWidth="1.5" />
    <path d="M180 135C180 145 220 145 220 135H180Z" fill="url(#authGold)" />

    {/* Sparkles indicating AI groundness */}
    <path d="M142 75L144 71L146 75L150 77L146 79L144 83L142 79L138 77L142 75Z" fill="#F5F0E8" />
    <path d="M178 75L180 71L182 75L186 77L182 79L180 83L178 79L174 77L178 75Z" fill="#F5F0E8" />
  </svg>
);

// 4. Onboarding Step 1 Illustration (Secure biometric identity card)
export const OnboardingNameIllustration = ({ className = "w-48 h-48", ...props }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2A3B5D" />
        <stop offset="100%" stopColor="#1B2A4A" />
      </linearGradient>
      <linearGradient id="onboardingGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E0C57A" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
    </defs>
    
    {/* Background glowing rings */}
    <circle cx="100" cy="100" r="75" stroke="#C9A84C" strokeWidth="1" strokeDasharray="3 6" opacity="0.3" />
    <circle cx="100" cy="100" r="60" stroke="#1A6B4A" strokeWidth="1.5" strokeDasharray="40 40" opacity="0.4" className="animate-spin" style={{ animationDuration: '20s' }} />

    {/* Floating Premium Document Badge */}
    <rect x="45" y="45" width="110" height="110" rx="20" fill="url(#cardGrad)" stroke="url(#onboardingGold)" strokeWidth="3" />
    
    {/* Simulated Chip/Security stamp */}
    <rect x="65" y="65" width="20" height="16" rx="4" fill="url(#onboardingGold)" />
    
    {/* Identity monogram lines */}
    <rect x="92" y="68" width="45" height="4" rx="2" fill="#F5F0E8" opacity="0.8" />
    <rect x="92" y="76" width="30" height="4" rx="2" fill="#F5F0E8" opacity="0.5" />
    
    {/* Golden User Silhouette inside badge */}
    <circle cx="100" cy="108" r="14" fill="url(#onboardingGold)" />
    <path d="M78 135C78 123 88 122 100 122C112 122 122 123 122 135H78Z" fill="url(#onboardingGold)" />
    
    {/* Green verification tick indicating secure step */}
    <circle cx="140" cy="130" r="14" fill="#1A6B4A" stroke="#1B2A4A" strokeWidth="2.5" />
    <path d="M133 130L137 134L147 124" stroke="#F5F0E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 5. Onboarding Step 2 Illustration (Elegant bilingual crescent globe)
export const LanguageGlobeIllustration = ({ className = "w-48 h-48", ...props }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="langGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0C57A" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
    </defs>

    {/* Background Glow */}
    <circle cx="100" cy="100" r="80" fill="#C9A84C" fillOpacity="0.04" />
    
    {/* Elegant Golden Crescent Outline representing Pakistan Identity */}
    <path
      d="M110 50C75 50 45 75 45 110C45 145 75 165 110 165C122 165 133 161 141 154C122 154 100 138 100 110C100 82 122 66 141 66C133 59 122 50 110 50Z"
      stroke="url(#langGold)"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* English "A" Side */}
    <g transform="translate(68, 92)" className="animate-float">
      <circle cx="0" cy="0" r="22" fill="#1B2A4A" stroke="url(#langGold)" strokeWidth="2" />
      <text
        x="0"
        y="6"
        fill="#F5F0E8"
        fontFamily="Inter, sans-serif"
        fontSize="18"
        fontWeight="800"
        textAnchor="middle"
      >
        A
      </text>
    </g>

    {/* Urdu "ق" (Qaf) Side */}
    <g transform="translate(132, 110)" className="animate-float" style={{ animationDelay: '1.5s' }}>
      <circle cx="0" cy="0" r="22" fill="#1A6B4A" stroke="url(#langGold)" strokeWidth="2" />
      <text
        x="0"
        y="6"
        fill="#F5F0E8"
        fontFamily="'Jameel Noori', 'Noto Nastaliq Urdu', serif"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
      >
        ق
      </text>
    </g>
    
    {/* Intertwining golden translation wave path */}
    <path
      d="M86 98C94 92 106 112 114 106"
      stroke="url(#langGold)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="4 4"
    />
  </svg>
);

// 6. Dashboard Hero Banner (Wide horizontal Pakistani Legal Compass)
export const DashboardCompassIllustration = ({ className = "w-full h-32 md:h-40", ...props }) => (
  <svg
    viewBox="0 0 600 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} rounded-[2rem]`}
    {...props}
  >
    <defs>
      <linearGradient id="dashNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1B2A4A" />
        <stop offset="100%" stopColor="#0B1324" />
      </linearGradient>
      <linearGradient id="dashGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C9A84C" />
        <stop offset="50%" stopColor="#E0C57A" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
    </defs>

    {/* Base Panel */}
    <rect width="600" height="160" fill="url(#dashNavyGrad)" />
    
    {/* Geometric Grid Background */}
    <path d="M0 40H600M0 80H600M0 120H600M150 0V160M300 0V160M450 0V160" stroke="#C9A84C" strokeWidth="0.5" opacity="0.1" />
    <circle cx="500" cy="80" r="120" stroke="#C9A84C" strokeWidth="0.75" opacity="0.15" />
    <circle cx="500" cy="80" r="80" stroke="#1A6B4A" strokeWidth="0.75" strokeDasharray="5 5" opacity="0.2" />

    {/* Text Title area */}
    <g transform="translate(40, 50)">
      <text fill="#C9A84C" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="900" letterSpacing="3" opacity="0.8">
        QANOON AI ADVISORY
      </text>
      <text fill="#F5F0E8" fontFamily="Inter, sans-serif" fontSize="22" fontWeight="900" y="30">
        Empowering Citizens
      </text>
      <text fill="#F5F0E8" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="600" y="52" opacity="0.6">
        With Grounded Legal Intelligence
      </text>
    </g>

    {/* Beautiful Golden Legal Compass graphic on the right */}
    <g transform="translate(500, 80)">
      {/* Outer Scale notches */}
      <circle r="50" stroke="url(#dashGoldGrad)" strokeWidth="1.5" opacity="0.8" />
      <circle r="44" stroke="url(#dashGoldGrad)" strokeWidth="0.75" strokeDasharray="2 3" />
      
      {/* Compass rose/star pointing true North (Justice) */}
      <path d="M0 -38L8 -10L35 0L8 10L0 38L-8 10L-35 0L-8 -10Z" fill="url(#dashGoldGrad)" />
      
      {/* Dynamic central AI core */}
      <circle r="6" fill="#F5F0E8" />
      
      {/* Scales icons hanging off left and right sides of compass implicitly */}
      <path d="M-22 -15H-12M22 -15H12" stroke="url(#dashGoldGrad)" strokeWidth="1" opacity="0.5" />
      <path d="M-17 -15V5M17 -15V5" stroke="url(#dashGoldGrad)" strokeWidth="1" opacity="0.5" />
    </g>

    {/* Tech particle floating waves */}
    <g stroke="url(#dashGoldGrad)" strokeWidth="1" opacity="0.3">
      <path d="M380 90C410 70 430 110 460 90" strokeDasharray="3 3" />
      <path d="M370 100C400 80 420 120 450 100" />
    </g>
    <circle cx="390" cy="93" r="2.5" fill="#1A6B4A" />
    <circle cx="440" cy="107" r="2" fill="#C9A84C" />
  </svg>
);

// 7. AskLex Chatbot (Empty State: Law book, desk lamp emitting gold cone, sparks)
export const ChatbotEmptyState = ({ className = "w-64 h-64 mx-auto", ...props }) => (
  <svg
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2A3B5D" />
        <stop offset="100%" stopColor="#1B2A4A" />
      </linearGradient>
      <linearGradient id="lampGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0C57A" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
      <linearGradient id="lightConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.0" />
      </linearGradient>
    </defs>

    {/* Warm light cone cast by lamp */}
    <polygon points="120,42 40,210 200,210" fill="url(#lightConeGrad)" />

    {/* Open Law Book (Centered on table plane) */}
    {/* Book spine backing */}
    <path d="M68 185C92 195 120 195 120 185C120 195 148 195 172 185" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />
    
    {/* Book Pages (Left & Right halves) */}
    <path d="M65 152C88 160 118 160 118 182V148C118 126 88 126 65 118V152Z" fill="#F5F0E8" stroke="#1B2A4A" strokeWidth="1" />
    <path d="M175 152C152 160 122 160 122 182V148C122 126 152 126 175 118V152Z" fill="#F5F0E8" stroke="#1B2A4A" strokeWidth="1" />
    
    {/* Page details/lines */}
    <path d="M75 130H108M75 138H108M75 146H100M132 130H165M132 138H165M132 146H148" stroke="#1B2A4A" strokeWidth="1.2" opacity="0.2" />

    {/* Red Ribbon Bookmark hanging out */}
    <path d="M120 162C120 185 112 195 115 205" stroke="#1A6B4A" strokeWidth="3.5" strokeLinecap="round" />

    {/* Sleek Minimalist Desk Lamp */}
    {/* Base */}
    <rect x="100" y="210" width="40" height="6" rx="2" fill="#1B2A4A" />
    {/* Arm */}
    <path d="M120 210V80C120 62 135 55 128 42" stroke="#1B2A4A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    {/* Shade */}
    <path d="M102 42C102 30 138 30 138 42H102Z" fill="url(#lampGoldGrad)" />
    
    {/* AI dialogue sparks / bubble floating up out of the book under light */}
    <g opacity="0.8">
      {/* Speech bubble 1 */}
      <rect x="42" y="85" width="45" height="22" rx="8" fill="#1A6B4A" />
      <polygon points="55,107 60,113 65,107" fill="#1A6B4A" />
      <text x="64.5" y="99" fill="#F5F0E8" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="bold" textAnchor="middle">Ask Lex</text>
      
      {/* Speech bubble 2 */}
      <rect x="155" y="70" width="40" height="22" rx="8" fill="#1B2A4A" stroke="url(#lampGoldGrad)" strokeWidth="1" />
      <polygon points="175,92 170,98 165,92" fill="#1B2A4A" />
      <circle cx="170" cy="81" r="1.5" fill="#C9A84C" />
      <circle cx="175" cy="81" r="1.5" fill="#C9A84C" />
      <circle cx="180" cy="81" r="1.5" fill="#C9A84C" />

      {/* Sparkles */}
      <path d="M110 102L112 99L114 102L117 103L114 104L112 107L110 104L107 103L110 102Z" fill="url(#lampGoldGrad)" />
      <path d="M130 90L131.5 87.5L133 90L135.5 91L133 92L131.5 94.5L130 92L127.5 91L130 90Z" fill="url(#lampGoldGrad)" />
    </g>
  </svg>
);

// 8. Verified Lawyer Monogram Avatar (Replaces random pravatar.cc URLs)
export const LawyerProfessionalAvatar = ({ initials = "ADV", seedIndex = 0, className = "w-20 h-20", ...props }) => {
  // Cycle through solid, beautiful legal colors representing our design system
  const bgColors = ["#1B2A4A", "#1A6B4A", "#2A3B5D", "#121D33"];
  const selectBg = bgColors[seedIndex % bgColors.length];
  
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} rounded-3xl overflow-hidden`}
      {...props}
    >
      <defs>
        <linearGradient id={`goldRing-${seedIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0C57A" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
      </defs>
      
      {/* Background Solid Card Plate */}
      <rect width="80" height="80" fill={selectBg} />
      
      {/* Inner premium double-ring border */}
      <circle cx="40" cy="40" r="35" stroke={`url(#goldRing-${seedIndex})`} strokeWidth="2.5" />
      <circle cx="40" cy="40" r="31" stroke={`url(#goldRing-${seedIndex})`} strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
      
      {/* Scales icon behind monograms */}
      <path d="M40 22V58M28 32H52" stroke="#F5F0E8" strokeWidth="1" opacity="0.15" strokeLinecap="round" />
      
      {/* Initials Text */}
      <text
        x="40"
        y="46"
        fill={`url(#goldRing-${seedIndex})`}
        fontFamily="Inter, sans-serif"
        fontSize="16"
        fontWeight="900"
        letterSpacing="0.5"
        textAnchor="middle"
      >
        {initials.toUpperCase().substring(0, 3)}
      </text>
      
      {/* Star ratings details implicitly represented inside the design */}
      <circle cx="34" cy="56" r="1.5" fill="#C9A84C" />
      <circle cx="40" cy="57" r="2" fill="#C9A84C" />
      <circle cx="46" cy="56" r="1.5" fill="#C9A84C" />
    </svg>
  );
};

// 9. Law Library Shelf Empty State (Leather-bound book collection PPC, PECA with golden bookmarks)
export const LibraryBooksIllustration = ({ className = "w-64 h-64 mx-auto", ...props }) => (
  <svg
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="spineGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#E0C57A" />
      </linearGradient>
    </defs>

    {/* Background light radius */}
    <circle cx="120" cy="120" r="80" fill="#C9A84C" fillOpacity="0.03" />

    {/* Solid Premium Wooden Bookshelf Floor */}
    <rect x="20" y="195" width="200" height="15" rx="3" fill="#1B2A4A" />
    <rect x="25" y="192" width="190" height="3" rx="1" fill="#C9A84C" />

    {/* Book 1 (Pakistan Penal Code - Green & Gold) */}
    <rect x="42" y="75" width="28" height="117" rx="3" fill="#1A6B4A" stroke="#C9A84C" strokeWidth="2.5" />
    <path d="M42 90H70M42 98H70M42 165H70" stroke="#C9A84C" strokeWidth="1.5" />
    <text x="56" y="132" fill="#F5F0E8" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="900" textAnchor="middle" transform="rotate(-90 56 132)">PPC</text>

    {/* Book 2 (PECA Cyber Law - Deep Navy & Gold) */}
    <rect x="74" y="65" width="30" height="127" rx="3" fill="#1B2A4A" stroke="#C9A84C" strokeWidth="2.5" />
    <path d="M74 80H104M74 88H104M74 175H104" stroke="#C9A84C" strokeWidth="1.5" />
    <text x="89" y="128" fill="#C9A84C" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="900" textAnchor="middle" transform="rotate(-90 89 128)">PECA</text>
    {/* Hanging Gold Ribbon Bookmark */}
    <path d="M89 192C91 202 88 208 93 214" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" />

    {/* Book 3 (Family Laws - Crimson Red/Gold styled in our cream accents) */}
    <rect x="108" y="85" width="26" height="107" rx="3" fill="#2A3B5D" stroke="#C9A84C" strokeWidth="2.5" />
    <path d="M108 97H134M108 103H134M108 160H134" stroke="#C9A84C" strokeWidth="1.5" />
    <text x="121" y="138" fill="#F5F0E8" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="800" textAnchor="middle" transform="rotate(-90 121 138)">FAMILY</text>

    {/* Book 4 (Leaning Law Manual - Cream/Gold) */}
    <g transform="translate(150, 90) rotate(14 13 47)">
      <rect x="0" y="0" width="28" height="107" rx="3" fill="#F5F0E8" stroke="#C9A84C" strokeWidth="2.5" />
      <path d="M0 15H28M0 23H28M0 85H28" stroke="#C9A84C" strokeWidth="1.5" />
      <text x="14" y="53" fill="#1B2A4A" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="900" textAnchor="middle" transform="rotate(-90 14 53)">CIVIL</text>
    </g>

    {/* Scientific Magnifying Glass exploring sections */}
    <g transform="translate(145, 110)" className="animate-float" style={{ animationDuration: '4s' }}>
      {/* Handle */}
      <line x1="28" y1="28" x2="52" y2="52" stroke="#1B2A4A" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="28" y1="28" x2="52" y2="52" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Glass Frame */}
      <circle cx="15" cy="15" r="18" fill="#C9A84C" fillOpacity="0.1" stroke="#1B2A4A" strokeWidth="3" />
      <circle cx="15" cy="15" r="18" stroke="#C9A84C" strokeWidth="1" />
      
      {/* Sparkles on glass */}
      <path d="M5 8L10 13" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

// 10. Dashboard Chatbot Tile Illustration (Layered 3D speech bubble with scales and Urdu letter ق)
export const DashboardChatbotTileIllustration = ({ className = "w-32 h-32", ...props }) => (
  <svg
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="tileGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0C57A" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
      <linearGradient id="tileGreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1A6B4A" />
        <stop offset="100%" stopColor="#124E35" />
      </linearGradient>
      <linearGradient id="tileNavy" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2A3B5D" />
        <stop offset="100%" stopColor="#1B2A4A" />
      </linearGradient>
    </defs>
    {/* Concentric neural path rays */}
    <circle cx="80" cy="80" r="70" stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
    <circle cx="80" cy="80" r="55" stroke="#1A6B4A" strokeWidth="0.5" opacity="0.3" />
    <path d="M10 80H150M80 10V150" stroke="#C9A84C" strokeWidth="0.5" opacity="0.15" />

    {/* Primary Speech bubble */}
    <path
      d="M35 45C35 36.7 41.7 30 50 30H110C118.3 30 125 36.7 125 45V90C125 98.3 118.3 105 110 105H75L50 125V105H50C41.7 105 35 98.3 35 90V45Z"
      fill="url(#tileNavy)"
      stroke="url(#tileGold)"
      strokeWidth="2.5"
    />

    {/* Elegant Golden Scales of Justice floating inside */}
    <path d="M80 42V82" stroke="url(#tileGold)" strokeWidth="1.5" opacity="0.4" />
    <path d="M60 48H100" stroke="url(#tileGold)" strokeWidth="1.5" opacity="0.4" />
    
    {/* Inner green speech bubble with Urdu ق */}
    <g transform="scale(0.8) translate(25, 20)">
      <path
        d="M70 70C70 61.7 76.7 55 85 55H115C123.3 55 130 61.7 130 70V100C130 108.3 123.3 115 115 115H95L80 127V115H85C76.7 115 70 108.3 70 100V70Z"
        fill="url(#tileGreen)"
        stroke="url(#tileGold)"
        strokeWidth="1.5"
      />
      <text
        x="100"
        y="92"
        fill="#F5F0E8"
        fontFamily="'Jameel Noori', 'Noto Nastaliq Urdu', serif"
        fontSize="24"
        fontWeight="bold"
        textAnchor="middle"
      >
        ق
      </text>
    </g>

    {/* Interactive spark particles */}
    <circle cx="25" cy="40" r="3.5" fill="url(#tileGold)" className="animate-pulse" />
    <circle cx="135" cy="100" r="2.5" fill="#1A6B4A" />
    <polygon points="135,35 137.5,40 142.5,40 138.5,43 140,48 135,45 130,48 131.5,43 127.5,40 132.5,40" fill="url(#tileGold)" />
  </svg>
);

// 11. AI Chatbot Screen Banner (Open legal volume resting beside traditional Pakistani oil lamp)
export const ChatbotBannerIllustration = ({ className = "w-48 h-48 mx-auto", ...props }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="lampGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0C57A" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
      <linearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1B2A4A" />
        <stop offset="100%" stopColor="#121D33" />
      </linearGradient>
      <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFDD7E" />
        <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.1" />
      </linearGradient>
    </defs>

    {/* Light glow radius */}
    <circle cx="100" cy="100" r="75" fill="#C9A84C" fillOpacity="0.02" />

    {/* Traditional Pakistani Brass Oil Lamp (Chiragh) representing enlightenment */}
    {/* Lamp base and neck */}
    <path
      d="M35 155C35 140 45 130 65 130C85 130 95 140 95 155H35Z"
      fill="url(#lampGoldGrad)"
      stroke="#1B2A4A"
      strokeWidth="2.5"
    />
    <path d="M50 130V95C50 90 80 90 80 95V130" stroke="#1B2A4A" strokeWidth="2.5" fill="none" />
    <path d="M40 95H90V105H40V95Z" fill="url(#lampGoldGrad)" stroke="#1B2A4A" strokeWidth="1.5" />
    
    {/* Glass Flame Protector */}
    <path
      d="M48 95C48 55 52 45 65 45C78 45 82 55 82 95H48Z"
      fill="#C9A84C"
      fillOpacity="0.1"
      stroke="url(#lampGoldGrad)"
      strokeWidth="1.5"
    />
    
    {/* Glowing Flame inside (representing justice enlightenment) */}
    <path
      d="M65 52C61 65 58 75 60 88C62 90 68 90 70 88C72 75 69 65 65 52Z"
      fill="url(#flameGrad)"
      className="animate-pulse"
    />

    {/* Beautiful open Law Book adjacent to the lamp */}
    {/* Cover */}
    <path d="M92 165C125 178 178 172 178 152V115C178 135 125 140 92 130V165Z" fill="url(#bookCoverGrad)" stroke="#C9A84C" strokeWidth="1.5" />
    {/* Pages */}
    <path d="M88 130C120 138 172 132 172 110V145C172 167 120 172 88 165V130Z" fill="#F5F0E8" stroke="#1B2A4A" strokeWidth="1.5" />
    <path d="M96 138C120 144 162 138 162 120" stroke="#1B2A4A" strokeWidth="1.2" opacity="0.3" />
    <path d="M96 146C120 152 162 146 162 128" stroke="#1B2A4A" strokeWidth="1.2" opacity="0.3" />
    <path d="M96 154C120 160 162 154 162 136" stroke="#1B2A4A" strokeWidth="1.2" opacity="0.3" />

    {/* Hanging Pakistani Crescent-star ribbon mark */}
    <path d="M128 134V180" stroke="#1A6B4A" strokeWidth="3" strokeLinecap="round" />
    <polygon points="128,180 125,176 131,176" fill="#1A6B4A" />

    {/* Glowing bilingually neural particles */}
    <g opacity="0.8" className="animate-float">
      <circle cx="150" cy="55" r="14" fill="#1B2A4A" stroke="url(#lampGoldGrad)" strokeWidth="1.5" />
      <text x="150" y="60" fill="#F5F0E8" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="900" textAnchor="middle">A</text>
    </g>
    <g opacity="0.8" className="animate-float" style={{ animationDelay: '2s' }}>
      <circle cx="115" cy="40" r="14" fill="#1A6B4A" stroke="url(#lampGoldGrad)" strokeWidth="1.5" />
      <text x="115" y="46" fill="#F5F0E8" fontFamily="'Jameel Noori', 'Noto Nastaliq Urdu', serif" fontSize="14" fontWeight="bold" textAnchor="middle">ق</text>
    </g>

    <path d="M125 58L126.5 55L128 58L130.5 59.5L128 61L126.5 64L125 61L122.5 59.5L125 58Z" fill="url(#lampGoldGrad)" />
  </svg>
);

// 12. Find a Lawyer directory Crest (Locator shield with map pins, scales, and gavel)
export const LawyerSearchHeroIllustration = ({ className = "w-48 h-48 mx-auto", ...props }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="shieldGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0C57A" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
      <linearGradient id="shieldGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1A6B4A" />
        <stop offset="100%" stopColor="#104730" />
      </linearGradient>
    </defs>

    {/* Geolocation target concentric coordinate circles */}
    <circle cx="100" cy="100" r="85" stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.5" />
    <circle cx="100" cy="100" r="70" stroke="#F5F0E8" strokeWidth="0.5" opacity="0.3" />
    <line x1="100" y1="10" x2="100" y2="190" stroke="#C9A84C" strokeWidth="0.5" opacity="0.2" />
    <line x1="10" y1="100" x2="190" y2="100" stroke="#C9A84C" strokeWidth="0.5" opacity="0.2" />

    {/* Grand Protective Shield */}
    <path
      d="M100 25C135 25 165 35 165 65C165 115 125 155 100 175C75 155 35 115 35 65C35 35 65 25 100 25Z"
      fill="url(#shieldGreenGrad)"
      stroke="url(#shieldGoldGrad)"
      strokeWidth="3.5"
      filter="drop-shadow(0px 8px 16px rgba(27,42,74,0.3))"
    />

    {/* Scales of Justice inside the Shield */}
    <path d="M100 50V130M70 65H130" stroke="url(#shieldGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M80 65L70 95M120 65L130 95" stroke="url(#shieldGoldGrad)" strokeWidth="1.5" />
    <path d="M60 95C60 102 80 102 80 95H60ZM120 95C120 102 140 102 140 95H120Z" fill="url(#shieldGoldGrad)" />

    {/* Sleek Golden Gavel centered at the base */}
    <g transform="translate(100, 115) rotate(45)">
      <rect x="-6" y="-12" width="12" height="24" rx="2" fill="url(#shieldGoldGrad)" stroke="#1B2A4A" strokeWidth="1.5" />
      <line x1="0" y1="12" x2="0" y2="40" stroke="url(#shieldGoldGrad)" strokeWidth="3.5" strokeLinecap="round" />
    </g>

    {/* Map Geolocation pins flanking the shield */}
    <g transform="translate(45, 95)" className="animate-bounce" style={{ animationDuration: '3s' }}>
      <path d="M10 0C4.5 0 0 4.5 0 10C0 17.5 10 28 10 28C10 28 20 17.5 20 10C20 4.5 15.5 0 10 0ZM10 14C7.8 14 6 12.2 6 10C6 7.8 7.8 6 10 6C12.2 6 14 7.8 14 10C14 12.2 12.2 14 10 14Z" fill="url(#shieldGoldGrad)" />
    </g>
    <g transform="translate(135, 60)" className="animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
      <path d="M10 0C4.5 0 0 4.5 0 10C0 17.5 10 28 10 28C10 28 20 17.5 20 10C20 4.5 15.5 0 10 0ZM10 14C7.8 14 6 12.2 6 10C6 7.8 7.8 6 10 6C12.2 6 14 7.8 14 10C14 12.2 12.2 14 10 14Z" fill="#F5F0E8" />
    </g>
  </svg>
);

// 13. My History Hourglass Empty State (Hourglass representing sessions and sandbox memory archives)
export const HistoryEmptyState = ({ className = "w-48 h-48 mx-auto", ...props }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="glassGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0C57A" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
      <linearGradient id="historyNavyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2A3B5D" />
        <stop offset="100%" stopColor="#1B2A4A" />
      </linearGradient>
    </defs>

    {/* Background memory neural orbit paths */}
    <circle cx="100" cy="100" r="80" stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
    <path d="M30 60C50 30 150 30 170 60" stroke="#1A6B4A" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />
    
    {/* Floating Parchment scrolls of previous cases */}
    <g transform="translate(30, 110) rotate(-15)" opacity="0.6">
      <rect x="0" y="0" width="30" height="42" rx="4" fill="#F5F0E8" stroke="#1B2A4A" strokeWidth="1.5" />
      <line x1="6" y1="10" x2="24" y2="10" stroke="#1B2A4A" strokeWidth="1" />
      <line x1="6" y1="18" x2="24" y2="18" stroke="#1B2A4A" strokeWidth="1" />
      <line x1="6" y1="26" x2="18" y2="26" stroke="#1B2A4A" strokeWidth="1" />
      <circle cx="20" cy="32" r="3" fill="#1A6B4A" />
    </g>
    <g transform="translate(140, 80) rotate(15)" opacity="0.6">
      <rect x="0" y="0" width="32" height="45" rx="4" fill="#F5F0E8" stroke="#1B2A4A" strokeWidth="1.5" />
      <line x1="6" y1="10" x2="26" y2="10" stroke="#1B2A4A" strokeWidth="1" />
      <line x1="6" y1="18" x2="26" y2="18" stroke="#1B2A4A" strokeWidth="1" />
      <line x1="6" y1="26" x2="20" y2="26" stroke="#1B2A4A" strokeWidth="1" />
      <circle cx="22" cy="34" r="3" fill="#C9A84C" />
    </g>

    {/* The Legal Hourglass */}
    {/* Frame Top and Bottom */}
    <rect x="65" y="35" width="70" height="10" rx="3" fill="url(#historyNavyGrad)" stroke="url(#glassGoldGrad)" strokeWidth="2" />
    <rect x="65" y="155" width="70" height="10" rx="3" fill="url(#historyNavyGrad)" stroke="url(#glassGoldGrad)" strokeWidth="2" />
    
    {/* Pillars supporting the frames */}
    <line x1="72" y1="45" x2="72" y2="155" stroke="url(#glassGoldGrad)" strokeWidth="3" />
    <line x1="128" y1="45" x2="128" y2="155" stroke="url(#glassGoldGrad)" strokeWidth="3" />

    {/* Glass bulb shape */}
    <path
      d="M78 45C78 90 92 92 92 100C92 108 78 110 78 155H122C122 110 108 108 108 100C108 92 122 90 122 45H78Z"
      fill="#F5F0E8"
      fillOpacity="0.1"
      stroke="url(#glassGoldGrad)"
      strokeWidth="2.5"
    />

    {/* Upper sand compartment (almost empty, representing passing sessions) */}
    <path d="M82 50H118C118 75 106 82 100 86C94 82 82 75 82 50Z" fill="url(#glassGoldGrad)" opacity="0.3" />
    {/* Falling sand stream */}
    <line x1="100" y1="84" x2="100" y2="148" stroke="url(#glassGoldGrad)" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" className="animate-pulse" />

    {/* Bottom sand compartment (accumulated legal consultations) */}
    <path d="M82 150C82 135 90 128 100 128C110 128 118 135 118 150H82Z" fill="url(#glassGoldGrad)" />
    
    {/* Sparkle detailing on history sands */}
    <path d="M96 112L97.5 109.5L99 112L101.5 113L99 114L97.5 116.5L96 114L93.5 113L96 112Z" fill="#1A6B4A" />
    <path d="M104 122L105.5 119.5L107 122L109.5 123L107 124L105.5 126.5L104 124L101.5 123L104 122Z" fill="url(#glassGoldGrad)" />
  </svg>
);

// 14. Profile Verified Identity Seal (Premium biometric finger grid, scales, and state stars)
export const ProfilePremiumBadge = ({ className = "w-32 h-32 mx-auto", ...props }) => (
  <svg
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="badgeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0C57A" />
        <stop offset="100%" stopColor="#C9A84C" />
      </linearGradient>
      <linearGradient id="badgeGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1A6B4A" />
        <stop offset="100%" stopColor="#145239" />
      </linearGradient>
    </defs>

    {/* Symmetrical Outer Laurel Wreath / Leaves */}
    <g fill="url(#badgeGoldGrad)" opacity="0.8">
      {/* Left Laurel */}
      <path d="M38 105C32 90 32 70 42 50C44.5 57 44.5 67 41 77" />
      <path d="M33 80C25 75 22 65 27 58C29 63 31 70 33 80Z" />
      <path d="M35 60C29 55 26 45 31 38C34 43 35 50 35 60Z" />
      
      {/* Right Laurel */}
      <path d="M122 105C128 90 128 70 118 50C115.5 57 115.5 67 119 77" />
      <path d="M127 80C135 75 138 65 133 58C131 63 129 70 127 80Z" />
      <path d="M125 60C131 55 134 45 129 38C126 43 125 50 125 60Z" />
    </g>

    {/* Double Ring Golden Badge Boundary */}
    <circle cx="80" cy="80" r="58" stroke="url(#badgeGoldGrad)" strokeWidth="3" />
    <circle cx="80" cy="80" r="53" stroke="url(#badgeGoldGrad)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
    
    {/* Inner Green verified background */}
    <circle cx="80" cy="80" r="50" fill="url(#badgeGreenGrad)" />

    {/* Stylized Digital Biometric Grid / Fingerprint contours (Absolute Privacy Security) */}
    <g stroke="url(#badgeGoldGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.25">
      <path d="M60 70C65 60 75 55 80 55C85 55 95 60 100 70" />
      <path d="M55 85C60 72 70 65 80 65C90 65 100 72 105 85" />
      <path d="M62 98C68 85 73 78 80 78C87 78 92 85 98 98" />
      <path d="M72 102C75 92 78 88 80 88C82 88 85 92 88 102" />
    </g>

    {/* Elegant Gold Scale of Justice over grid */}
    {/* Beam and Plates */}
    <path d="M55 75H105" stroke="url(#badgeGoldGrad)" strokeWidth="2" strokeLinecap="round" />
    <path d="M80 62V98" stroke="url(#badgeGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M68 75L62 90M92 75L98 90" stroke="url(#badgeGoldGrad)" strokeWidth="1" />
    <path d="M57 90C57 94 67 94 67 90H57ZM87 90C87 94 97 94 97 90H87Z" fill="url(#badgeGoldGrad)" />

    {/* Crescent and Star of Pakistan at the top of badge */}
    <path
      d="M82 34C81.4 34 80.8 34.1 80.3 34.5C81 34.6 81.5 35.2 81.5 36C81.5 36.8 81 37.4 80.3 37.5C80.8 37.9 81.4 38 82 38C83.1 38 84 37.1 84 36C84 34.9 83.1 34 82 34Z"
      fill="#F5F0E8"
    />
    <polygon points="85,34 85.5,35.5 87,35.5 85.8,36.2 86.2,37.7 85,37 83.8,37.7 84.2,36.2 83,35.5 84.5,35.5" fill="#F5F0E8" />
  </svg>
);

