// tailwind.config.cjs
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // All your React components
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/forms'), // Only if you need it
    ],
  };
  