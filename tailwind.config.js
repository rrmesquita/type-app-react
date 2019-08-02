// See default config https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  ...defaultTheme,
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", ...defaultTheme.fontFamily.sans]
      }
    }
  }
};
