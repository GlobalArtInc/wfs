module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "parserOptions": {
    "project": "./tsconfig.json",
    "sourceType": "module"
  },
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "env": {
    "es6": true,
    "node": true
  },
  "overrides": [
    {
      "files": ["*.js"],
      "rules": {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ],
  "rules": {
    "no-var": "error",
    "one-var": [2, "never"],
    "prefer-const": "error",
    "no-duplicate-imports": "error",
    "no-self-compare": "error",
    "no-use-before-define": "error",
    "semi": "warn",
    "curly": "warn",
    "indent": [
      "off",
      2,
      {
        "MemberExpression": 1,
        "SwitchCase": 1,
        "ignoredNodes": [
          "FunctionExpression > .params[decorators.length > 0]",
          "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
          "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key"
        ]
      }
    ],
    "newline-per-chained-call": "off",
    "no-multi-spaces": "warn",
    "no-multiple-empty-lines": "warn",
    "space-in-parens": "warn",
    "no-trailing-spaces": "warn",
    "array-element-newline": [
      "warn",
      {
        "ArrayExpression": "consistent",
        "ArrayPattern": {
          "minItems": 5
        }
      }
    ],
    "arrow-spacing": "warn",
    "key-spacing": [
      "warn",
      {
        "beforeColon": false,
        "afterColon": true
      }
    ],
    "keyword-spacing": [
      "warn",
      {
        "before": true,
        "after": true
      }
    ],
    "new-parens": ["warn", "always"],
    "padding-line-between-statements": [
      "warn",
      {
        "blankLine": "always",
        "prev": "*",
        "next": "return"
      }
    ],
    "rest-spread-spacing": ["warn", "never"],
    "quotes": ["off"],
    "template-curly-spacing": ["warn", "never"],
    "prettier/prettier": [
      "warn",
      {
        "singleQuote": true,
        "tabWidth": 2,
        "trailingComma": "all",
        "bracketSpacing": true,
        "semi": true,
        "useTabs": false,
        "arrowParens": "always",
        "printWidth": 120
      }
    ]
  }
}
