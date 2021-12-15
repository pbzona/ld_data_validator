const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

const { traverse, validate } = require('./src/validate');
const { isFlagConfigFile, readFlagConfig, getFilesChangedInLastCommit, getModifiedFlags, getFlagModifications, getFlagKeyForFile } = require('./src/util');

try {
  const commitCount = process.env.INPUT_COMMITCOUNT;
  core.setOutput('commitCount', commitCount);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  core.setOutput('event', payload);

  // Export list of files changed in last commit
  const filesChanged = getFilesChangedInLastCommit();
  core.setOutput('filesChanged', filesChanged);

  // Export list of flags modified in last commit
  const flagsChanged = getModifiedFlags(filesChanged);
  core.setOutput('flagsChanged', flagsChanged); // remove duplicates in case flag changed in multiple environments

  // Export flag modifications
  const flagModifications = {};
  filesChanged.filter(file => {
    return isFlagConfigFile(file);
  }).forEach(file => {
    flagModifications[getFlagKeyForFile(file)] = getFlagModifications(file);
  });
  core.setOutput('flagModifications', flagModifications);

  // Do the validation here
  traverse(validate);
} catch(err) {
  core.setFailed(err.message);
}