const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const { isFlagConfigFile, parseFlagKey, parseFlagEnv, parseFlagProject } = require('./parser');

const readFlagConfig = (pathToFile) => {
  // Returns a json object ready to use
  return JSON.parse(fs.readFileSync(pathToFile).toString());
}

// Returns array of files that were changed in this commit
const getFilesChangedInLastCommit = () => {
  const filesChanged = execSync(`git diff --name-only HEAD HEAD~${process.env.INPUT_COMMITCOUNT - 1}`);
  return filesChanged.toString().split('\n');
}

// Return array of keys of flags that were changed in this commit
const getModifiedFlags = (updatedFiles) => {
  const flags = updatedFiles.filter(updatedFile => {
      return isFlagConfigFile(updatedFile);
    }).map(modifiedFlagFile => {
      return {
        key: parseFlagKey(modifiedFlagFile),
        env: parseFlagEnv(modifiedFlagFile),
        project: parseFlagProject(modifiedFlagFile)
      };
    });

  return flags;
}

// Returns an object
const getFlagModifications = (pathToFile) => {
  // Need branch to reset checkout as looking back will cause us to enter a detached HEAD state
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD');

  const modifications = {}
  modifications.new = readFlagConfig(pathToFile);
  execSync(`git checkout HEAD~${process.env.INPUT_COMMITCOUNT - 1}`);
  
  // What happens for newly created flag files?
  if (fs.existsSync(pathToFile)) {
    modifications.old = readFlagConfig(pathToFile);
  } else {
    modifications.old = {}
  }

  // Go back to current branch before returning result
  execSync(`git checkout ${currentBranch}`);
  return modifications;
}

module.exports = {
  readFlagConfig,
  getFilesChangedInLastCommit,
  getModifiedFlags,
  getFlagModifications
}