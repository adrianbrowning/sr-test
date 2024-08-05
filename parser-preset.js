export default {
    parserPreset: {
        parserOpts: {
            headerPattern: /^(issue-\d+): (.*)$/,
            headerCorrespondence: ['issue', 'subject']
        }
    },
}
