module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        purple: {
          101: "#7f1fff",
        },
      },
      gridTemplateColumns: {
        30: "1fr 50px 1fr",
      },
    },
  },
  plugins: [],
};
