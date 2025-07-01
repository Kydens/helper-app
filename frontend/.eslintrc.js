module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:nuxt/recommended",
    "plugin:prettier/recommended", // mengintegrasikan Prettier
  ],
  rules: {
    // Custom rules jika kamu mau
    "vue/multi-word-component-names": "off",
    "prettier/prettier": ["error"],
  },
};
