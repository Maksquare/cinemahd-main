'use client';

import React from 'react';

interface AdBannerProps {
  className?: string;
  label?: string;
}

export const AdBanner300x250: React.FC<AdBannerProps> = ({
  className = '',
  label = 'Advertisement',
}) => {
  const adSrcDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '1046b5ece6d7c169b298fc2063b03279',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highrevenueformat.com/1046b5ece6d7c169b298fc2063b03279/invoke.js"></script>
  </body>
</html>`;

  return (
    <aside
      className={`flex flex-col items-center justify-center my-4 ${className}`}
      aria-label={label}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1.5 select-none">
        {label}
      </span>
      <div className="relative w-[300px] h-[250px] overflow-hidden rounded-xl border border-white/10 bg-[#0d0f15]/90 shadow-xl flex items-center justify-center backdrop-blur-md">
        <iframe
          title="Sponsored Advertisement"
          srcDoc={adSrcDoc}
          width={300}
          height={250}
          scrolling="no"
          frameBorder="0"
          className="w-[300px] h-[250px] border-0 overflow-hidden"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </aside>
  );
};
