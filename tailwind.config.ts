import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Semantic financial colors
        income: {
          DEFAULT: "#10B981", // Vibrant Emerald
          light: "#ECFDF5",
          dark: "#064E3B",
        },
        expense: {
          DEFAULT: "#F43F5E", // Vibrant Rose
          light: "#FFF1F2",
          dark: "#881337",
        },
        transfer: {
          DEFAULT: "#6366F1", // Vibrant Indigo
          light: "#EEF2FF",
          dark: "#312E81",
        },
        invest: {
          DEFAULT: "#8B5CF6", // Purple/Violet
          light: "#F5F3FF",
          dark: "#4C1D95",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "2xl": "1.125rem",
        xl: "0.875rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(16, 185, 129, 0.3)",
        "glow-indigo": "0 0 25px -5px rgba(99, 102, 241, 0.3)",
        "glow-rose": "0 0 25px -5px rgba(244, 63, 94, 0.3)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.2s infinite",
        "pulse-subtle": "pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 4s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "-apple-system", "BlinkMacSystemFont", "Inter", "sans-serif"],
        mono: ["SF Mono", "Fira Code", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
