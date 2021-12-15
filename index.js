const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

const { traverse, validate, getFilesChangedInLastCommit, getModifiedFlags } = require('./src/validate');

try {
  const time = new Date().toTimeString();
  core.setOutput('time', time);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  core.setOutput('event', payload);

  // Export list of files changed in last commit
  filesChanged = getFilesChangedInLastCommit();
  core.setOutput('filesChanged', filesChanged);

  // Export list of flags modified in last commit
  flagsChanged = getModifiedFlags(filesChanged);
  core.setOutput('flagsChanged', flagsChanged); // remove duplicates in case flag changed in multiple environments

  // Do the validation here
  traverse(validate);
} catch(err) {
  core.setFailed(err.message);
}