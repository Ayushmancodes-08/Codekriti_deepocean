import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Responsive typography scaling
        'h1': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['clamp(1.5rem, 4vw, 2.25rem)', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['clamp(1.25rem, 3vw, 1.75rem)', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['clamp(0.875rem, 1vw, 1rem)', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['clamp(0.75rem, 0.9vw, 0.875rem)', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        // Design system spacing scale: 8px, 16px, 24px, 32px, 48px, 64px
        'xs': '0.5rem',    // 8px
        'sm': '1rem',      // 16px
        'md': '1.5rem',    // 24px
        'lg': '2rem',      // 32px
        'xl': '3rem',      // 48px
        'xxl': '4rem',     // 64px
      },
      borderRadius: {
        'sm': '0.25rem',   // 4px
        'md': '0.5rem',    // 8px
        'lg': '1rem',      // 16px
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Design system colors from specification
        orange: {
          DEFAULT: '#FF6B35',
          50: '#FFF5F0',
          100: '#FFE5D9',
          200: '#FFCBB3',
          300: '#FFB18D',
          400: '#FF9166',
          500: '#FF6B35',
          600: '#E55A24',
          700: '#CC4A1A',
          800: '#B23A10',
          900: '#992A06',
        },
        'dark-blue': {
          DEFAULT: '#1A1A2E',
          50: '#F5F5F7',
          100: '#EBEBF0',
          200: '#D7D7E0',
          300: '#C3C3D0',
          400: '#AFAFC0',
          500: '#9B9BB0',
          600: '#6B6B80',
          700: '#3B3B50',
          800: '#1A1A2E',
          900: '#0F0F1A',
        },
        cyan: {
          DEFAULT: '#00D9FF',
          50: '#F0FFFF',
          100: '#E0FFFF',
          200: '#B3FFFF',
          300: '#80FFFF',
          400: '#4DFFFF',
          500: '#00D9FF',
          600: '#00B8CC',
          700: '#0097A3',
          800: '#00767A',
          900: '#005551',
        },
        gray: {
          50: '#F5F5F5',
          100: '#EEEEEE',
          200: '#E0E0E0',
          300: '#D0D0D0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        success: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        error: {
          DEFAULT: '#F44336',
          light: '#EF5350',
          dark: '#D32F2F',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Floating animations
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "float-fast": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-25px)" },
        },
        // Glow and pulse animations
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 217, 255, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 217, 255, 0.6)" },
        },
        // Shimmer effect
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Bubble animations
        "bubble-rise": {
          "0%": { transform: "translateY(100vh) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-100vh) scale(1)", opacity: "0" },
        },
        "bubble-float": {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%": { opacity: "0.5" },
          "90%": { opacity: "0.5" },
          "100%": { transform: "translateY(-100vh) translateX(100px)", opacity: "0" },
        },
        // Jellyfish animations
        "jellyfish-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-15px) rotate(2deg)" },
          "75%": { transform: "translateY(10px) rotate(-2deg)" },
        },
        "jellyfish-tentacle": {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.1)" },
        },
        // Stone modal animations
        "stone-drop": {
          "0%": { transform: "translateY(-100vh) scale(0.8)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        "stone-bounce": {
          "0%": { transform: "translateY(0) scale(1)" },
          "25%": { transform: "translateY(20px) scale(0.95)" },
          "50%": { transform: "translateY(0) scale(1)" },
          "75%": { transform: "translateY(10px) scale(0.98)" },
          "100%": { transform: "translateY(0) scale(1)" },
        },
        // Form animations
        "slide-in": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        // Sway animation
        "sway": {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "float-fast": "float-fast 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "bubble-rise": "bubble-rise 8s ease-in-out infinite",
        "bubble-float": "bubble-float 10s ease-in-out infinite",
        "jellyfish-float": "jellyfish-float 5s ease-in-out infinite",
        "jellyfish-tentacle": "jellyfish-tentacle 3s ease-in-out infinite",
        "stone-drop": "stone-drop 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "stone-bounce": "stone-bounce 2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-in",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-in",
        "shake": "shake 0.5s ease-in-out",
        "sway": "sway 4s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "shimmer": "linear-gradient(90deg, transparent 0%, hsl(190, 100%, 50%, 0.1) 50%, transparent 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
