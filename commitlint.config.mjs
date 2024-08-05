import lint from "@commitlint/lint";

import conventionalConfig from "@commitlint/config-conventional";

const bodyConfig = {
        ...conventionalConfig.rules,
        "subject-case": [2, "always", ["sentence-case", "lower-case"]],
        "type-empty": [2, "never"],
}

async function custBody({body}) {
    if (!body) {
        return [false, 'Body must not be empty'];
    }
    const lines = body.split('\n');
    const bodyPattern = /^fix: .+$/;
    if (lines.length > 0 && bodyPattern.test(lines[0])) {
        const result = await lint(body, bodyConfig);
        if (result.valid) {
            return [true];
        }
        return [false, result.errors.map(error => error.message).join('\n')];
    }
    return [false, 'Body must start with: fix:'];
}

export default  {

    rules: {
        // 'header-max-length': [2, 'always', 100],
        // 'header-min-length': [2, 'always', 3],
        // 'header-case': [2, 'always', 'lower-case'],

        // 'body-max-line-length': [2, 'always', 100],
        'custom-header-format': [2, 'always', /^(\w+[-])?[0-9]+$/],
        'custom-body-format': [2, 'always', custBody]
    },
    plugins: [
        {
            rules: {
                'custom-header-format': ({ header }) => {
                    const headerPattern = /^(\w+[-])?[0-9]+$/;
                    if (headerPattern.test(header)) {
                        return [true];
                    }
                    return [false, 'Header must match pattern: issue-##'];
                },
                'custom-body-format': async (arg) => {
                    console.log(arg)
                    const { body } = arg;
                    const result = await custBody({ body });
                    return result;
                }
            }
        }
    ]
};


// export default {
//     // parserPreset: './parser-preset',
//     "extends": ["@commitlint/config-conventional"],
//     /*plugins: [
//         {
//             rules: {
//                 "header-match-team-pattern": (parsed) => {
//                     console.log(parsed);
//                     const {type, scope, subject, header} = parsed;
//
//                     if (!/(\w+[-])?[0-9]+/g.test(header)) {
//                         return [
//                             false,
//                             "header must be in format 'issue-##'",
//                         ];
//                     }
//
//                     return [true, ""];
//                 },
//             },
//         },
//     ],*/
//     "rules": {
//         'header-pattern': [2, 'always', /^issue-\d+$/],
//         'body-leading-blank': [2, 'always', true],
//         'body-max-line-length': [2, 'always', 100],
//         'body-min-length': [2, 'always', 5],
//         'footer-leading-blank': [1, 'always', true],
//         'footer-max-line-length': [2, 'always', 100],
//         'subject-empty': [2, 'never'],
//         'subject-min-length': [2, 'always', 5],
//         // 'type-empty': [2, 'never'],
//         'type-enum': [2, 'always', ['fix']],
//
//         "subject-case": [2, "always", ["sentence-case", "lower-case"]],
//         "type-empty": [2, "never"],
//
//     },
//
// };
