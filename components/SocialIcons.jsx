import React from "react";

// Realistic multi-colored Instagram Icon with official sunset gradient
export const InstagramIcon = ({ className = "h-5 w-5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#igGradient)" />
    <path
      fill="#ffffff"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
      transform="scale(0.7) translate(5.1, 5.1)"
    />
  </svg>
);

// Realistic Facebook Icon with official Meta blue background & crisp white f
export const FacebookIcon = ({ className = "h-5 w-5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <rect width="24" height="24" rx="12" fill="#1877F2" />
    <path
      fill="#ffffff"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      transform="scale(0.75) translate(4, 4)"
    />
  </svg>
);

// Realistic TikTok Icon with official Cyan/Red music note on black badge
export const TikTokIcon = ({ className = "h-5 w-5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <rect width="24" height="24" rx="6" fill="#000000" />
    {/* Cyan Offset Shadow */}
    <path
      fill="#00F2FE"
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.83.12V9.3a6.27 6.27 0 0 0-.83-.06A6.33 6.33 0 0 0 3.15 15.6 6.34 6.34 0 0 0 9.5 21.93a6.33 6.33 0 0 0 6.33-6.33V9.05a8.16 8.16 0 0 0 4.92 1.62V7.24a4.85 4.85 0 0 1-1.16-.55z"
      transform="scale(0.7) translate(4.5, 4.5)"
    />
    {/* Pink/Magenta Offset Shadow */}
    <path
      fill="#FF0050"
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.83.12V9.3a6.27 6.27 0 0 0-.83-.06A6.33 6.33 0 0 0 3.15 15.6 6.34 6.34 0 0 0 9.5 21.93a6.33 6.33 0 0 0 6.33-6.33V9.05a8.16 8.16 0 0 0 4.92 1.62V7.24a4.85 4.85 0 0 1-1.16-.55z"
      transform="scale(0.7) translate(5.5, 5.5)"
    />
    {/* White Main Note */}
    <path
      fill="#FFFFFF"
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.83.12V9.3a6.27 6.27 0 0 0-.83-.06A6.33 6.33 0 0 0 3.15 15.6 6.34 6.34 0 0 0 9.5 21.93a6.33 6.33 0 0 0 6.33-6.33V9.05a8.16 8.16 0 0 0 4.92 1.62V7.24a4.85 4.85 0 0 1-1.16-.55z"
      transform="scale(0.7) translate(5, 5)"
    />
  </svg>
);

// Realistic X (Twitter) Icon with sleek black badge and sharp white X logo
export const XIcon = ({ className = "h-5 w-5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <rect width="24" height="24" rx="6" fill="#000000" />
    <path
      fill="#ffffff"
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      transform="scale(0.65) translate(6.5, 6.5)"
    />
  </svg>
);

// Realistic WhatsApp Icon with official WhatsApp green badge & white phone bubble
export const WhatsAppIcon = ({ className = "h-5 w-5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <rect width="24" height="24" rx="12" fill="#25D366" />
    <path
      fill="#ffffff"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.015-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.174-1.236-6.159-3.487-8.411"
      transform="scale(0.7) translate(5, 5)"
    />
  </svg>
);

// Realistic Gmail Icon with official Google 4-color branding
export const GmailIcon = ({ className = "h-4 w-4", ...props }) => (
  <svg viewBox="0 0 24 24" className={className} {...props}>
    <path fill="#4285F4" d="M2.5 19.5h3.5v-9l-3.5-2.625z" />
    <path fill="#34A853" d="M18 19.5h3.5v-11.625l-3.5 2.625z" />
    <path fill="#EA4335" d="M18 7.875V4.5L12 9 6 4.5v3.375L12 12.375z" />
    <path fill="#FBBC04" d="M2.5 7.875v-3.375C2.5 3.395 3.395 2.5 4.5 2.5h1.5v5.375z" />
    <path fill="#C5221F" d="M18 2.5h1.5c1.105 0 2 .895 2 2v3.375h-3.5z" />
  </svg>
);

// High-definition South Africa Flag Vector SVG (Cross-platform support)
export const SouthAfricaFlag = ({ className = "h-4 w-6 rounded-[2px] shadow-sm inline-block shrink-0" }) => (
  <svg viewBox="0 0 900 600" className={className} aria-label="South Africa Flag">
    {/* Base Green */}
    <rect width="900" height="600" fill="#007a3d" />
    {/* Red Top */}
    <path d="M0,0 h900 v200 H300 Z" fill="#de3831" />
    {/* Blue Bottom */}
    <path d="M0,600 h900 v-200 H300 Z" fill="#002395" />
    {/* White Chevron */}
    <path d="M0,0 L450,300 L0,600 Z" fill="#ffffff" />
    {/* Green Chevron cutout */}
    <path d="M0,45 L382.5,300 L0,555 Z" fill="#007a3d" />
    {/* Gold Chevron */}
    <path d="M0,75 L337.5,300 L0,525 Z" fill="#ffb81c" />
    {/* Black Triangle */}
    <path d="M0,125 L262.5,300 L0,475 Z" fill="#000000" />
  </svg>
);

export const FORTIFIED_SOCIALS = [
  {
    name: "Instagram",
    handle: "@fortified_brand",
    href: "https://www.instagram.com/fortified_brand",
    Icon: InstagramIcon,
  },
  {
    name: "Facebook",
    handle: "Fortified Brand",
    href: "https://web.facebook.com/profile.php?id=61592905169879",
    Icon: FacebookIcon,
  },
  {
    name: "TikTok",
    handle: "@fortified_brand",
    href: "https://www.tiktok.com/@fortified_brand",
    Icon: TikTokIcon,
  },
  {
    name: "X (Twitter)",
    handle: "@fortified98",
    href: "https://x.com/fortified98?s=11",
    Icon: XIcon,
  },
  {
    name: "WhatsApp",
    handle: "+27 68 594 0131",
    href: "https://wa.me/27685940131",
    Icon: WhatsAppIcon,
  },
];
