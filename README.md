# JS Lectern Client 

## Features:
- Runs different restrictions validations: regex, range, scripts, required fields, type checks, etc.
- Transforms the data from string to their proper type.
- Report validation errors.
- Fetch dictionaries from the configured lectern service. 
- Provide typed definitions for the dictionary object.
- Analyze dictionary versions diff.


## Usage examples:
- icgc-argo/argo-clinical [https://github.com/icgc-argo/argo-clinical]


## to release new version

- bump the version number

- publish to npm and tag git:
Jenkinsfile will do that when a commit is added to master.
if you need to do that manually then run `npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}" && npm publish` 
