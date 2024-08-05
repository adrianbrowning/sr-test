import lint from "@commitlint/lint";




export default  {
    "extends": "@commitlint/config-conventional",
    rules: {
        "subject-case": [2, "always", ["sentence-case", "lower-case"]],
        "type-empty": [2, "never"],
    },
};




// import lint from "@commitlint/lint";
//
// import conventionalConfig from "@commitlint/config-conventional";
//
// const bodyConfig = {
//         ...conventionalConfig.rules,
//         "subject-case": [2, "always", ["sentence-case", "lower-case"]],
//         "type-empty": [2, "never"],
// }
//
// const headerRegex = /(^(\w+[-])?[0-9]+$|^\w+(\s+|-)\d+\s+\(#\d+\)$)/;
//
// async function custBody({body}) {
//     if (!body) {
//         return [false, 'Body must not be empty'];
//     }
//     const lines = body.split('\n');
//     if (lines.length > 0 ) {
//         const result = await lint(body, bodyConfig);
//         if (result.valid) {
//             return [true];
//         }
//         return [false, result.errors.map(error => error.message).join('\n')];
//     }
//     return [false, 'Body must have content'];
// }
//
// export default  {
//
//     rules: {
//         'custom-header-format': [2, 'always', headerRegex],
//         'custom-body-format': [2, 'always', custBody]
//     },
//     plugins: [
//         {
//             rules: {
//                 'custom-header-format': (arg) => {
//                     const { header, body } = arg;
//                     if (body.includes('[skip ci]'))  return [true];
//                     const headerPattern = headerRegex;
//                     if (headerPattern.test(header.trim())) {
//                         return [true];
//                     }
//                     return [false, 'Header must match pattern: ' + headerRegex.toString() + ` [${header.trim()}]`];
//                 },
//                 'custom-body-format': async (arg) => {
//                     const { body } = arg;
//                     if (body.includes('[skip ci]'))  return [true];
//                     const result = await custBody({ body });
//                     return result;
//                 }
//             }
//         }
//     ]
// };
//
//
