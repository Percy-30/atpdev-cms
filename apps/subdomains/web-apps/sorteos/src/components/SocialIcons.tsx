import React from 'react';

export const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const YoutubeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.88-4.46V8.75a8.17 8.17 0 0 0 4.79 1.54V6.85a4.85 4.85 0 0 1-.9-.16z" />
  </svg>
);

export const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const TwitterIcon = XIcon;

export const ThreadsIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.186 24c-3.593 0-6.52-.942-8.468-2.723C1.693 19.474.75 16.822.75 13.555c0-3.414.992-6.14 2.949-8.103C5.666 3.48 8.513 2.5 12.14 2.5c3.673 0 6.55.992 8.553 2.949 1.956 1.91 2.957 4.61 2.978 8.026v.612h-3.43c-.07-2.316-.723-4.14-1.942-5.42C17.067 7.37 14.98 6.7 12.14 6.7c-2.748 0-4.836.685-6.205 2.039C4.607 10.05 3.95 11.96 3.95 14.417c0 2.378.634 4.254 1.884 5.578 1.282 1.356 3.251 2.045 5.852 2.045 3.298 0 5.485-.985 6.498-2.927.423-.807.65-1.802.7-3.003-1.02.504-2.222.766-3.57.766-3.87 0-6.17-1.87-6.17-4.998 0-3.262 2.518-5.118 6.438-5.118 3.518 0 5.766 1.623 6.436 4.646.06.27.09.547.1.832v.364c0 3.32-.86 6.012-2.556 8.001C17.72 22.793 15.316 24 12.186 24zm-.89-10.74c1.19 0 2.15-.312 2.85-.929.62-.547.96-1.32.96-2.18 0-.9-.37-1.63-1.05-2.07-.63-.41-1.57-.62-2.76-.62-2.09 0-3.4.99-3.4 2.57 0 .84.34 1.54.98 2.02.6.45 1.45.69 2.42.69z" />
  </svg>
);

