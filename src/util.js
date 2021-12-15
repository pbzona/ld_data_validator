const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const readFlagConfig = (path) => {
  // Returns a json object ready to use
  return JSON.parse(fs.readFileSync(path).toString());
}

// Tells whether a file is a flag configuration file or not
const isFlagConfigFile = (filePath) => {
  return path.parse(filePath).dir.split('/')[0] == 'projects';
}

// Returns array of files that were changed in this commit
const getFilesChangedInLastCommit = () => {
  const filesChanged = execSync(`git diff --name-only HEAD HEAD~${process.env.INPUT_COMMITCOUNT - 1}`);
  return filesChanged.toString().split('\n');
}

const getFlagKeyForFile = (pathToFile) => {
  const flagConfigDir = path.parse(pathToFile).dir.split('/');
  return flagConfigDir[flagConfigDir.length - 1];
}

// Return array of keys of flags that were changed in this commit
const getModifiedFlags = (updatedFiles) => {
  const flags = updatedFiles.filter(file => {
      return isFlagConfigFile(file);
    }).map(file => {
      return getFlagKeyForFile(file);
    });

  return [...new Set(flags)]; // Removes duplicates since each flag dir could have multiple changed files
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
  isFlagConfigFile,
  getFilesChangedInLastCommit,
  getFlagKeyForFile,
  getModifiedFlags,
  getFlagModifications
}