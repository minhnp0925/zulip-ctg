"use strict";

const confusingBrowserGlobals = require("confusing-browser-globals");

module.exports = {
    root: true,
    env: {
        es2020: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:no-jquery/recommended",
        "plugin:no-jquery/deprecated",
        "plugin:unicorn/recommended",
        "prettier",
    ],
    parser: "@babel/eslint-parser",
    parserOptions: {
        requireConfigFile: false,
        warnOnUnsupportedTypeScriptVersion: false,
        sourceType: "unambiguous",
    },
    plugins: ["formatjs", "no-jquery"],
    settings: {
        formatjs: {
            additionalFunctionNames: ["$t", "$t_html"],
        },
        "no-jquery": {
            collectionReturningPlugins: {
                expectOne: "always",
            },
            variablePattern: "^\\$(?!t$|t_html$).",
        },
    },
    reportUnusedDisableDirectives: true,
    rules: {
        "array-callback-return": "error",
        "arrow-body-style": "error",
        "block-scoped-var": "error",
        "consistent-return": "error",
        curly: "error",
        "dot-notation": "error",
        eqeqeq: "error",
        "formatjs/enforce-default-message": ["error", "literal"],
        "formatjs/enforce-placeholders": [
            "error",
            {ignoreList: ["b", "code", "em", "i", "kbd", "p", "strong"]},
        ],
        "formatjs/no-id": "error",
        "guard-for-in": "error",
        "import/extensions": ["error", "ignorePackages"],
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-cycle": ["error", {ignoreExternal: true}],
        "import/no-duplicates": "error",
        "import/no-self-import": "error",
        "import/no-unresolved": "off",
        "import/no-useless-path-segments": "error",
        "import/order": ["error", {alphabetize: {order: "asc"}, "newlines-between": "always"}],
        "import/unambiguous": "error",
        "lines-around-directive": "error",
        "new-cap": "error",
        "no-alert": "error",
        "no-array-constructor": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-catch-shadow": "error",
        "no-constant-condition": ["error", {checkLoops: false}],
        "no-div-regex": "error",
        "no-else-return": "error",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-implicit-coercion": "error",
        "no-implied-eval": "error",
        "no-inner-declarations": "off",
        "no-iterator": "error",
        "no-jquery/no-append-html": "error",
        "no-jquery/no-constructor-attributes": "error",
        "no-jquery/no-parse-html-literal": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-loop-func": "error",
        "no-multi-str": "error",
        "no-native-reassign": "error",
        "no-new-func": "error",
        "no-new-object": "error",
        "no-new-wrappers": "error",
        "no-octal-escape": "error",
        "no-plusplus": "error",
        "no-proto": "error",
        "no-restricted-globals": ["error", ...confusingBrowserGlobals],
        "no-return-assign": "error",
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sync": "error",
        "no-throw-literal": "error",
        "no-undef-init": "error",
        "no-unneeded-ternary": ["error", {defaultAssignment: false}],
        "no-unused-expressions": "error",
        "no-unused-vars": [
            "error",
            {args: "all", argsIgnorePattern: "^_", ignoreRestSiblings: true},
        ],
        "no-use-before-define": ["error", {functions: false, variables: false}],
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-var": "error",
        "object-shorthand": ["error", "always", {avoidExplicitReturnArrows: true}],
        "one-var": ["error", "never"],
        "prefer-arrow-callback": "error",
        "prefer-const": ["error", {ignoreReadBeforeAssign: true}],
        radix: "error",
        "sort-imports": ["error", {ignoreDeclarationSort: true}],
        "spaced-comment": ["error", "always", {markers: ["/"]}],
        strict: "error",
        "unicorn/consistent-function-scoping": "off",
        "unicorn/explicit-length-check": "off",
        "unicorn/filename-case": "off",
        "unicorn/no-await-expression-member": "off",
        "unicorn/no-negated-condition": "off",
        "unicorn/no-null": "off",
        "unicorn/no-process-exit": "off",
        "unicorn/no-useless-undefined": "off",
        "unicorn/numeric-separators-style": "off",
        "unicorn/prefer-global-this": "off",
        "unicorn/prefer-module": "off",
        "unicorn/prefer-string-raw": "off",
        "unicorn/prefer-ternary": "off",
        "unicorn/prefer-top-level-await": "off",
        "unicorn/prevent-abbreviations": "off",
        "unicorn/switch-case-braces": "off",
        "valid-typeof": ["error", {requireStringLiterals: true}],
        yoda: "error",
    },
    overrides: [
        {
            files: ["web/tests/**"],
            rules: {
                "no-jquery/no-selector-prop": "off",
            },
        },
        {
            files: ["web/e2e-tests/**"],
            globals: {
                zulip_test: false,
            },
        },
        {
            files: ["web/src/**"],
            globals: {
                StripeCheckout: false,
            },
        },
        {
            files: ["**/*.cts", "**/*.mts", "**/*.ts"],
            excludedFiles: "help-beta/**",
            extends: [
                "plugin:@typescript-eslint/strict-type-checked",
                "plugin:@typescript-eslint/stylistic-type-checked",
                "plugin:import/typescript",
            ],
            parserOptions: {
                project: "tsconfig.json",
            },
            settings: {
                "import/resolver": {
                    node: {
                        extensions: [".ts", ".d.ts", ".js"], // https://github.com/import-js/eslint-plugin-import/issues/2267
                    },
                },
            },
            globals: {
                JQuery: false,
            },
            rules: {
                // Disable base rule to avoid conflict
                "no-use-before-define": "off",

                "@typescript-eslint/consistent-type-assertions": [
                    "error",
                    {assertionStyle: "never"},
                ],
                "@typescript-eslint/consistent-type-definitions": ["error", "type"],
                "@typescript-eslint/consistent-type-imports": "error",
                "@typescript-eslint/explicit-function-return-type": [
                    "error",
                    {allowExpressions: true},
                ],
                "@typescript-eslint/member-ordering": "error",
                "@typescript-eslint/method-signature-style": "error",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-unnecessary-condition": "off",
                "@typescript-eslint/no-unnecessary-qualifier": "error",
                "@typescript-eslint/no-unused-vars": [
                    "error",
                    {args: "all", argsIgnorePattern: "^_", ignoreRestSiblings: true},
                ],
                "@typescript-eslint/no-use-before-define": [
                    "error",
                    {functions: false, variables: false},
                ],
                "@typescript-eslint/parameter-properties": "error",
                "@typescript-eslint/promise-function-async": "error",
                "@typescript-eslint/restrict-plus-operands": ["error", {}],
                "@typescript-eslint/restrict-template-expressions": ["error", {}],
                "no-undef": "error",
            },
        },
        {
            files: ["help-beta/**.ts"],
            extends: [
                "plugin:@typescript-eslint/strict-type-checked",
                "plugin:@typescript-eslint/stylistic-type-checked",
                "plugin:import/typescript",
            ],
            parserOptions: {
                project: "help-beta/tsconfig.json",
            },
            settings: {
                "import/resolver": {
                    node: {
                        extensions: [".ts", ".d.ts", ".js"], // https://github.com/import-js/eslint-plugin-import/issues/2267
                    },
                },
            },
            globals: {
                JQuery: false,
            },
            rules: {
                // Disable base rule to avoid conflict
                "no-use-before-define": "off",

                "@typescript-eslint/consistent-type-assertions": [
                    "error",
                    {assertionStyle: "never"},
                ],
                "@typescript-eslint/consistent-type-definitions": ["error", "type"],
                "@typescript-eslint/consistent-type-imports": "error",
                "@typescript-eslint/explicit-function-return-type": [
                    "error",
                    {allowExpressions: true},
                ],
                "@typescript-eslint/member-ordering": "error",
                "@typescript-eslint/method-signature-style": "error",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-unnecessary-condition": "off",
                "@typescript-eslint/no-unnecessary-qualifier": "error",
                "@typescript-eslint/no-unused-vars": [
                    "error",
                    {args: "all", argsIgnorePattern: "^_", ignoreRestSiblings: true},
                ],
                "@typescript-eslint/no-use-before-define": [
                    "error",
                    {functions: false, variables: false},
                ],
                "@typescript-eslint/parameter-properties": "error",
                "@typescript-eslint/promise-function-async": "error",
                "@typescript-eslint/restrict-plus-operands": ["error", {}],
                "@typescript-eslint/restrict-template-expressions": ["error", {}],
                "no-undef": "error",
            },
        },
        {
            files: ["**/*.d.ts"],
            rules: {
                "import/unambiguous": "off",
            },
        },
        {
            files: ["web/e2e-tests/**", "web/tests/**"],
            globals: {
                CSS: false,
                document: false,
                navigator: false,
                window: false,
            },
            rules: {
                "formatjs/no-id": "off",
                "new-cap": "off",
                "no-sync": "off",
                "unicorn/prefer-prototype-methods": "off",
            },
        },
        {
            files: ["web/debug-require.js"],
            env: {
                browser: true,
                es2020: false,
            },
            rules: {
                // Don’t require ES features that PhantomJS doesn’t support
                // TODO: Toggle these settings now that we don't use PhantomJS
                "no-var": "off",
                "object-shorthand": "off",
                "prefer-arrow-callback": "off",
            },
        },
        {
            files: ["web/shared/**", "web/src/**", "web/third/**"],
            env: {
                browser: true,
                node: false,
            },
            globals: {
                DEVELOPMENT: false,
                ZULIP_VERSION: false,
            },
            rules: {
                "no-console": "error",
            },
            settings: {
                "import/resolver": {
                    webpack: {
                        config: "./web/webpack.config.ts",
                    },
                },
            },
        },
        {
            files: ["web/shared/**"],
            env: {
                browser: false,
                "shared-node-browser": true,
            },
            rules: {
                "import/no-restricted-paths": [
                    "error",
                    {
                        zones: [
                            {
                                target: "./web/shared",
                                from: ".",
                                except: ["./node_modules", "./web/shared"],
                            },
                        ],
                    },
                ],
                "unicorn/prefer-string-replace-all": "off",
            },
        },
        {
            files: ["web/server/**"],
            env: {
                node: true,
            },
        },
    ],
};
