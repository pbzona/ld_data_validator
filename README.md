# LD Data Validator

This project validates flag configuration for our bidirectional flag config sync Moonshots project.

## How to use

1. Make any desired changes to the application code - the entrypoint is `index.js` and the logic lives in `src/validate.js`.

2. Build the application by running `npm run build` (this is not automated yet, you must do it manually)

3. Commit and tag your release - `git tag -a -m "your message here" v0.x`

4. Be sure to push the tags to GitHub using `git push --follow-tags`

5. Update the [example repo](https://github.com/pbzona/ld_bisync_example) to use the new version of this action.