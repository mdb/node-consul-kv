module.exports = {
  "parserOptions": {
    "ecmaVersion": 6
  },
  "env": {
    "node": true,
    "es6": true
  },
 "globals": {
    "it": true,
    "describe": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
