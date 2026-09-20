import React from 'react';

interface AndroidLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Modern Official Android Logo (Bugdroid Robot Head)
 * Features transparent cutout eyes and angled antennae.
 */
export const AndroidLogo: React.FC<AndroidLogoProps> = ({
  className = 'h-5 w-5',
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Left Antenna */}
      <line
        x1="7.2"
        y1="7.8"
        x2="4.8"
        y2="3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Right Antenna */}
      <line
        x1="16.8"
        y1="7.8"
        x2="19.2"
        y2="3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Head Dome with Transparent Cutout Eyes */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 16.5C3.5 11.53 7.3 7.5 12 7.5C16.7 7.5 20.5 11.53 20.5 16.5H3.5ZM8.5 13C9.05228 13 9.5 12.5523 9.5 12C9.5 11.4477 9.05228 11 8.5 11C7.94772 11 7.5 11.4477 7.5 12C7.5 12.5523 7.94772 13 8.5 13ZM15.5 13C16.0523 13 16.5 12.5523 16.5 12C16.5 11.4477 16.0523 11 15.5 11C14.9477 11 14.5 11.4477 14.5 12C14.5 12.5523 14.9477 13 15.5 13Z"
        fill="currentColor"
      />
    </svg>
  );
};
