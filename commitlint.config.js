export default {
    "extends": [ "@commitlint/config-conventional" ],
    "rules": {
        "subject-case": [ 2, "always", [ "sentence-case", "lower-case" ]],
        "type-empty": [ 2, "never" ],
    },
};
