# LD Data Validator

This project validates flag configuration for our bidirectional flag config sync Moonshots project.

## How to use

1. Make any desired changes to the application code.

2. Build the application by running `npm run build` (this is not automated yet, you must do it manually)

3. Commit and push your changes, **including** the `dist/index.js` file (IMPORTANT) - this is what will be executed and there is no build step when this action is downloaded!!

5. If necessary, update the [example repo](https://github.com/pbzona/ld_bisync_example) (or whatever repo is using this action) to use the new version of this action. Currently it will run whatever is on the main branch, but the version can be specified to a different branch or a tag for testing.