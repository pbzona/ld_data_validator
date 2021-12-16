const core = require('@actions/core');
const github = require('@actions/github');

const { traverse, validate } = require('./src/validate');
const { getFilesChangedInLastCommit, getModifiedFlags, getFlagModifications } = require('./src/util');
const { isFlagConfigFile, parseFlagKey, parseFlagEnv } = require('./src/parser');
const { makeSyncRequest } = require('./src/sync');

try {
  (async function main() {

    const commitCount = process.env.INPUT_COMMITCOUNT;
    core.setOutput('commitCount', commitCount);
    
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    core.setOutput('event', payload);
    
    // Do the validation here
    validate(payload.commits);
    
    // Export list of files changed in last commit
    const filesChanged = getFilesChangedInLastCommit();
    core.setOutput('filesChanged', filesChanged);
    
    // Export list of flags modified in last commit
    const flagsChanged = getModifiedFlags(filesChanged);
    core.setOutput('flagsChanged', flagsChanged);
    
    // Export flag modifications
    const flagModifications = {};
    filesChanged.filter(changedFile => {
      return isFlagConfigFile(changedFile);
    }).forEach(modifiedFile => {
      const objKey = parseFlagKey(modifiedFile) + "_" + parseFlagEnv(modifiedFile);
      flagModifications[objKey] = getFlagModifications(modifiedFile);
    });
    core.setOutput('flagModifications', flagModifications);
    
    // Try to sync changes to LD
    if (flagsChanged.length > 0) {
      for (let flag of flagsChanged) {
        const modKey = `${flag.key}_${flag.env}`;
        const apiResponse = makeSyncRequest(
          flag.project,
          flag.env,
          flag.key,
          flagModifications[modKey].new,
          flagModifications[modKey].old
          );
          
          console.log(apiResponse);
        }
      }
  })();
} catch(err) {
  core.setFailed(err.message);
}