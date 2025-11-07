import React from "react";
import Image from "next/image";

// // Google Icon - รองรับ Dark Mode
// export const GoogleIcon = ({
//   className = "w-4 h-4",
// }: {
//   className?: string;
// }) => (
//   <svg
//     className={className}
//     viewBox="0 0 24 24"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//       fill="#4285F4"
//       className="dark:fill-[#4285F4]"
//     />
//     <path
//       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//       fill="#34A853"
//       className="dark:fill-[#34A853]"
//     />
//     <path
//       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//       fill="#FBBC05"
//       className="dark:fill-[#FBBC05]"
//     />
//     <path
//       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//       fill="#EA4335"
//       className="dark:fill-[#EA4335]"
//     />
//   </svg>
// );

// Google Trends Icon - ใช้รูปภาพ SVG แทน SVG
export const GoogleTrendsIcon = ({
  className = "w-4 h-4",
}: {
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    {/* Light Mode Image */}
    <Image
      src="/images/google-trend-icon.svg"
      alt="Google Trends"
      fill
      className="object-contain dark:hidden"
    />
    {/* Dark Mode Image */}
    <Image
      src="/images/google-trend-icon.svg"
      alt="Google Trends"
      fill
      className="object-contain hidden dark:block"
    />
  </div>
);

// TikTok Icon - รองรับ Dark Mode
export const TikTokIcon = ({
  className = "w-4 h-4",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"
      fill="#000000"
      className="dark:fill-white"
    />
  </svg>
);

// X (Twitter) Icon - รองรับ Dark Mode
export const XIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      fill="currentColor"
      className="text-black dark:text-white"
    />
  </svg>
);

// Reddit Icon - ใช้รูปภาพแทน SVG
export const RedditIcon = ({
  className = "w-6 h-6",
}: {
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    <Image
      src="/images/reddit-logo.png"
      alt="Reddit"
      fill
      className="object-contain"
    />
  </div>
);

// Gather Icon - ใช้รูปภาพแทน SVG
export const GatherIcon = ({
  className = "w-6 h-6",
}: {
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    {/* Light Mode Image */}
    <Image
      src="/images/gb-logo-light.png"
      alt="Gather"
      fill
      className="object-contain dark:hidden"
    />
    {/* Dark Mode Image */}
    <Image
      src="/images/gb-logo-dark.png"
      alt="Gather"
      fill
      className="object-contain hidden dark:block"
    />
  </div>
);

// Demo component
const BrandIconsDemo = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Brand Icons - Dark Mode Support
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors">
          <GoogleTrendsIcon className="w-12 h-12" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Google
          </span>
        </div>

        <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors">
          <TikTokIcon className="w-12 h-12" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            TikTok
          </span>
        </div>

        <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors">
          <XIcon className="w-12 h-12" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            X (Twitter)
          </span>
        </div>

        <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors">
          <RedditIcon className="w-12 h-12" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Reddit
          </span>
        </div>

        <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors">
          <GatherIcon className="w-12 h-12" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Gather
          </span>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        Toggle your system theme to see the dark mode effects
      </div>
    </div>
  );
};

export default BrandIconsDemo;