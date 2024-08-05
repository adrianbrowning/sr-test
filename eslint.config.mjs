/* eslint-disable */
import {fixupConfigRules} from '@eslint/compat'
import globals from 'globals'
import {FlatCompat} from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "node:path";
import {fileURLToPath} from "node:url";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const ERROR = 'error'
const WARN = 'warn'

const has = (pkg) => {
    try {
        import.meta.resolve(pkg, import.meta.url)
        return true
    } catch {
        return false
    }
}

const hasTypeScript = has('typescript')
const hasReact = has('react')
const hasTestingLibrary = has('@testing-library/dom')
const hasJestDom = has('@testing-library/jest-dom')
const hasVitest = has('vitest')
const vitestFiles = ['**/__tests__/**/*', '**/*.test.*']
const testFiles = ['**/tests/**', '**/#tests/**', ...vitestFiles]
const playwrightFiles = ['**/e2e/**']

export const config = [
    {
        ignores: [
            '**/.cache/**',
            '**/node_modules/**',
            '**/build/**',
            '**/public/build/**',
            '**/playwright-report/**',
            '**/server-build/**',
            '**/dist/**',
        ],
    },
    ...fixupConfigRules(
        compat.extends("plugin:node/recommended")
    ),
    ...compat.extends(
        "eslint:recommended",
        "plugin:promise/recommended",
        "plugin:security-node/recommended",
    ),
    // all files
    {
        plugins: {
            import: (await import('eslint-plugin-import-x')).default,
            promise: (await import('eslint-plugin-promise')).default,
            "security-node": (await import('eslint-plugin-security-node')).default,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "security-node/detect-crlf": "off",
            "security-node/detect-unhandled-event-errors": "off",
            'no-unexpected-multiline': ERROR,
            'no-warning-comments': [
                ERROR,
                {terms: ['FIXME'], location: 'anywhere'},
            ],
            // 'import/no-duplicates': [WARN, { 'prefer-inline': true }],
            "prefer-promise-reject-errors": [
                "error"
            ],
            "promise/always-return": [
                "error"
            ],
            "promise/catch-or-return": [
                "error",
                {
                    "allowThen": true
                }
            ],

            "node/file-extension-in-import": [
                "error",
                "always"
            ],
            "node/no-missing-import": ["off"],
            "node/no-unpublished-import": ["off"],
            "max-nested-callbacks": "error",
            "no-debugger": ["warn"],
            "no-fallthrough": ["warn"],
            "no-return-await": [
                "error"
            ],
            "no-await-in-loop": ["warn"], //optional
        },
    },

    // JSX/TSX files
    // hasReact ? compat.extends("plugin:react/recommended")[0] : null,
    hasReact
        ? {
            files: ['**/*.tsx', '**/*.jsx'],
            ...reactRecommended,
            plugins: {
                react: (await import('eslint-plugin-react')).default,
            },
            settings: { react: { version: "detect" } },
            languageOptions: {
                parser: (await import('typescript-eslint')).parser,
                parserOptions: {
                    jsx: true,
                    project: './tsconfig.json',
                    projectService: true,
                },
            },
            rules: {
                "react/jsx-no-constructed-context-values": ["error"],
                "react/jsx-no-script-url": ["error", [{"name": "Link", "props": ["to"]}]],
                "react/jsx-no-target-blank": ["error", {
                    "allowReferrer": false,
                    "enforceDynamicLinks": "never",
                    "forms": false,
                    "links": true,
                    "warnOnSpreadAttributes": true
                }],
                "react/jsx-props-no-spreading": ["error"],
                "react/jsx-uses-react": ["error"],
                "react/no-array-index-key": ["error"],
                "react/no-danger": ["error"],
                "react/no-danger-with-children": ["error"],
                "react/no-unknown-property": ["error"],
                "react/no-unused-prop-types": ["error"],
                "react/react-in-jsx-scope": ["error"],
                "react/sort-prop-types": ["error", {
                    "callbacksLast": true,
                    "ignoreCase": false,
                    "noSortAlphabetically": false,
                    "requiredFirst": true,
                    "sortShapeProp": true
                }],
                "react/jsx-key": ["error", {"checkFragmentShorthand": true, "warnOnDuplicates": true}],
                "react/jsx-no-bind": ["error"],
                "react/jsx-first-prop-new-line": ["error"],
                "react/button-has-type": ["error"],
                "react/default-props-match-prop-types": ["error"],
                "react/destructuring-assignment": ["error", "always"],
                "react/display-name": ["error"],
            },
        }
        : null,

    // react-hook rules are applicable in ts/js/tsx/jsx, but only with React as a
    // dep

    hasReact ? compat.extends("plugin:react-hooks/recommended")[0] : null,
    hasReact
        ? {
            files: ['**/*.ts?(x)', '**/*.js?(x)'],
            plugins: {
                // 'react-hooks': fixupPluginRules(
                // 	await import('eslint-plugin-react-hooks'),
                // ),
            },
            rules: {
                "react-hooks/exhaustive-deps": ["error"],
                "react-hooks/rules-of-hooks": ["error"],
            },
        }
        : null,

    // JS and JSX files
    {
        files: ['**/*.js?(x)'],
        rules: {
            // most of these rules are useful for JS but not TS because TS handles these better
            // if it weren't for https://github.com/import-js/eslint-plugin-import/issues/2132
            // we could enable this :(
            // 'import/no-unresolved': ERROR,
            'no-unused-vars': [
                WARN,
                {
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },

    // TS and TSX files
    // hasTypeScript ? compat.extends("@typescript-eslint/recommended")[0] : null,
    hasTypeScript
        ? {
            files: ['**/*.ts?(x)'],
            languageOptions: {
                parser: (await import('typescript-eslint')).parser,
                parserOptions: {
                    projectService: true,
                },
            },
            plugins: {
                '@typescript-eslint': (await import('typescript-eslint')).plugin,
            },
            rules: {
                "no-redeclare": "off",
                "@typescript-eslint/no-explicit-any": "error",
                "@typescript-eslint/array-type": [
                    "error",
                    {
                        "default": "generic"
                    }
                ],
                "@typescript-eslint/await-thenable": [
                    "error"
                ],
                "@typescript-eslint/consistent-type-imports": [
                    "error",
                    {
                        prefer: 'type-imports',
                        "fixStyle": "separate-type-imports",
                        disallowTypeAnnotations: true,
                    }
                ],
                "@typescript-eslint/no-floating-promises": ["error"],
                "@typescript-eslint/no-misused-promises": ["error"],
                "@typescript-eslint/no-unnecessary-condition": ["error"],
                "@typescript-eslint/no-unnecessary-type-assertion": "error",
                "@typescript-eslint/no-unused-vars": [
                    "error",
                    {
                        args: "after-used",
                        "argsIgnorePattern": "^_",
                        "caughtErrorsIgnorePattern": "^_",
                        "varsIgnorePattern": "^_",
                        ignoreRestSiblings: true,
                    }
                ],
                "@typescript-eslint/promise-function-async": [
                    "error"
                ],
                "@typescript-eslint/method-signature-style": [
                    "error",
                    "property"
                ],
                'import/consistent-type-specifier-style': [WARN, 'prefer-inline'],


                // here are rules we've decided to not enable. Commented out rather
                // than setting them to disabled to avoid them being referenced at all
                // when config resolution happens.

                // @typescript-eslint/require-await - sometimes you really do want
                // async without await to make a function async. TypeScript will ensure
                // it's treated as an async function by consumers and that's enough for me.

                // @typescript-eslint/prefer-promise-reject-errors - sometimes you
                // aren't the one creating the error and you just want to propogate an
                // error object with an unknown type.

                // @typescript-eslint/only-throw-error - same reason as above.
                // However this rule supports options to allow you to throw `any` and
                // `unknown`. Unfortunately, in Remix you can throw Response objects
                // and we don't want to enable this rule for those cases.

                // @typescript-eslint/no-unsafe-declaration-merging - this is a rare
                // enough problem (especially if you focus on types over interfaces)
                // that it's not worth enabling.

                // @typescript-eslint/no-unsafe-enum-comparison - enums are not
                // recommended or used in epic projects, so it's not worth enabling.

                // @typescript-eslint/no-unsafe-unary-minus - this is a rare enough
                // problem that it's not worth enabling.

                // @typescript-eslint/no-base-to-string - this doesn't handle when
                // your object actually does implement toString unless you do so with
                // a class which is not 100% of the time. For example, the timings
                // object in the epic stack uses defineProperty to implement toString.
                // It's not high enough risk/impact to enable.

                // @typescript-eslint/no-non-null-assertion - normally you should not
                // use ! to tell TS to ignore the null case, but you're a responsible
                // adult and if you're going to do that, the linter shouldn't yell at
                // you about it.

                // @typescript-eslint/restrict-template-expressions - toString is a
                // feature of many built-in objects and custom ones. It's not worth
                // enabling.

                // @typescript-eslint/no-confusing-void-expression - what's confusing
                // to one person isn't necessarily confusing to others. Arrow
                // functions that call something that returns void is not confusing
                // and the types will make sure you don't mess something up.

                // these each protect you from `any` and while it's best to avoid
                // using `any`, it's not worth having a lint rule yell at you when you
                // do:
                // - @typescript-eslint/no-unsafe-argument
                // - @typescript-eslint/no-unsafe-call
                // - @typescript-eslint/no-unsafe-member-access
                // - @typescript-eslint/no-unsafe-return
                // - @typescript-eslint/no-unsafe-assignment
            },
        }
        : null,

    // This assumes test files are those which are in the test directory or have
    // *.test.* in the filename. If a file doesn't match this assumption, then it
    // will not be allowed to import test files.
    {
        files: ['**/*.ts?(x)', '**/*.js?(x)'],
        ignores: testFiles,
        rules: {
            'no-restricted-imports': [
                ERROR,
                {
                    patterns: [
                        {
                            group: testFiles,
                            message: 'Do not import test files in source files',
                        },
                    ],
                },
            ],
        },
    },

    hasTestingLibrary
        ? {
            files: testFiles,
            ignores: [...playwrightFiles],
            plugins: {
                'testing-library': (await import('eslint-plugin-testing-library'))
                    .default,
            },
            rules: {
                'testing-library/no-unnecessary-act': [ERROR, {isStrict: false}],
                'testing-library/no-wait-for-side-effects': ERROR,
                'testing-library/prefer-find-by': ERROR,
            },
        }
        : null,

    hasJestDom
        ? {
            files: testFiles,
            ignores: [...playwrightFiles],
            plugins: {
                'jest-dom': (await import('eslint-plugin-jest-dom')).default,
            },
            rules: {
                'jest-dom/prefer-checked': ERROR,
                'jest-dom/prefer-enabled-disabled': ERROR,
                'jest-dom/prefer-focus': ERROR,
                'jest-dom/prefer-required': ERROR,
            },
        }
        : null,

    hasVitest
        ? {
            files: testFiles,
            ignores: [...playwrightFiles],
            plugins: {
                vitest: (await import('eslint-plugin-vitest')).default,
            },
            rules: {
                // you don't want the editor to autofix this, but we do want to be
                // made aware of it
                'vitest/no-focused-tests': [WARN, {fixable: false}],
            },
        }
        : null,
].filter(Boolean)

// this is for backward compatibility
export default config
