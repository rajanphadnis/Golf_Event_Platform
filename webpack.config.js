const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    main: "./public-main-src/index.js",
    terms: "./public-main-src/terms.js",
  },
  output: {
    path: path.resolve(__dirname, "public/main/js"),
  },
};
