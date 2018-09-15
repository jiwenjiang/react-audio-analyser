module.exports = {
    "parser": "babel-eslint",
    "env": {
        "commonjs": true,
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "globals": {
        "self":true,
        "importScripts":true
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-console": 0,
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
    }
}