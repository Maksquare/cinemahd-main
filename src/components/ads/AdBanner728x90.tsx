'use client';

import React from 'react';

interface AdBanner728x90Props {
  className?: string;
  label?: string;
}

export const AdBanner728x90: React.FC<AdBanner728x90Props> = ({
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
        'key' : 'a6218b4d7e6ec0b295d80ea1231d7760',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://www.highrevenueformat.com/a6218b4d7e6ec0b295d80ea1231d7760/invoke.js"></script>
  </body>
</html>`;

  return (
    <aside
      className={`w-full flex flex-col items-center justify-center my-6 ${className}`}
      aria-label={label}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1.5 select-none">
        {label}
      </span>
      <div className="w-full max-w-full overflow-x-auto no-scrollbar flex justify-center py-0.5">
        <div className="w-[728px] h-[90px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#0d0f15]/90 shadow-xl flex items-center justify-center backdrop-blur-md">
          <iframe
            title="Sponsored Leaderboard"
            srcDoc={adSrcDoc}
            width={728}
            height={90}
            scrolling="no"
            frameBorder="0"
            className="w-[728px] h-[90px] border-0 overflow-hidden"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </aside>
  );
};
