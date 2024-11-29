module.exports = {
  plugins: {
    "postcss-nested": {},
    "postcss-preset-env": {
      stage: 1,
      features: {
        "nesting-rules": true,
      },
    },
  },
};
