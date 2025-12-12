/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        primary: {
          DEFAULT: "var(--accent-primary)",
          foreground: "var(--bg-primary)",
        },
        secondary: "var(--bg-secondary)",
        gold: {
          DEFAULT: "#C5A265",
          5: "rgba(197, 162, 101, 0.05)",
          10: "rgba(197, 162, 101, 0.1)",
          20: "rgba(197, 162, 101, 0.2)",
        },
        navy: {
          DEFAULT: "#0A1A2F",
          light: "#0F1E36",
          lighter: "#1A2C42",
        },
        muted: {
          foreground: "var(--text-secondary)",
        },
        card: "var(--card-bg)",
        border: "var(--glass-border)",
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      }
    },
  },
  plugins: [],
};
