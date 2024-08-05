import lint from "@commitlint/lint";

import conventionalConfig from "@commitlint/config-conventional";
import {RuleConfigSeverity} from "@commitlint/types";

const bodyConfig = {
        ...conventionalConfig.rules,
        "subject-case": [2, "always", ["sentence-case", "lower-case"]],
        "type-empty": [2, "never"],
        'body-max-line-length': [0, "never"]
}

const headerRegex = /(^(\w+[-])?[0-9]+$|^\w+(\s+|-)\d+\s+\(#\d+\)$)/;

async function custBody({body}) {
    if (!body) {
        return [false, 'Body must not be empty'];
    }
    const lines = body.split('\n');
    if (lines.length > 0 ) {
        const result = await lint(body, bodyConfig);
        if (result.valid) {
            return [true];
        }
        return [false, result.errors.map(error => error.message).join('\n')];
    }
    return [false, 'Body must have content'];
}

export default  {

    rules: {
        'custom-header-format': [2, 'always', headerRegex],
        'custom-body-format': [2, 'always', custBody]
    },
    plugins: [
        {
            rules: {
                'custom-header-format': (args) => {
                    const { header, rawbody } = args;
                    console.log(rawbody)
                    const headerPattern = headerRegex;
                    if (headerPattern.test(header.trim())) {
                        return [true];
                    }
                    return [false, 'Header must match pattern: ' + headerRegex.toString() + ` [${header.trim()}]`];
                },
                'custom-body-format': async (arg) => {
                    const { body } = arg;
                    const result = await custBody({ body });
                    return result;
                }
            }
        }
    ]
};


