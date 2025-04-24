import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss";
import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  important: false,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/assets/svgs/*.svg"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        ...defaultTheme.screens,
      },
      backgroundImage: {
        "auth-bg": "url('/src/assets/background.svg')",
      },
      colors: {
        "affiliate-deep-blue": "#1814F3",
        "affiliate-blue": "#343C6A",
        "affiliate-red": "#FF4B4A",
        "affiliate-green": "#41D4A8",
        "affiliate-black": "#232323",
        "affiliate-gray": "#B1B1B1",
        "affiliate-primary-blue": "#2D60FF",
        cyan: colors.cyan,
        emerald: colors.emerald,
        ...defaultTheme.colors,
      },
      fontFamily: {
        inter: ["Inter", ...defaultTheme.fontFamily.sans],
        lato: ["Lato", ...defaultTheme.fontFamily.sans],
        gordita: ["Gorditas", "serif"], // Ensure fonts with spaces have " " surrounding it.
      },
    },
  },
  plugins: [],
});
