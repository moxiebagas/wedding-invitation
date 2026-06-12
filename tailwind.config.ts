import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome palette — black, white, grayscale, soft neutrals.
        ink: "#141414",
        graphite: "#2b2b2b",
        ash: "#6f6f6f",
        mist: "#f3f2ef",
        paper: "#ffffff",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        body: ["var(--font-cormorant)", "serif"],
        script: ["var(--font-greatvibes)", "cursive"],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.12)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 1s ease forwards",
        "slide-up": "slide-up 0.9s ease forwards",
        "ken-burns": "ken-burns 18s ease-out infinite alternate",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
