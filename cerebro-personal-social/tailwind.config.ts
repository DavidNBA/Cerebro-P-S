import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // For Next.js pages directory (if used)
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // For Next.js app directory
  ],
  theme: {
    extend: {
      // Example: backgroundImage: {
      //   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      //   'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      // },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable class-based dark mode
};

export default config;
