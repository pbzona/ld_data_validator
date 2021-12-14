const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

try {
  const time = new Date().toTimeString();
  core.setOutput('time', time);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  core.setOutput('event', payload);

  // Export the cwd for debugging
  const cwd = process.cwd();
  core.setOutput('cwd', cwd);

  // Export file structure for debugging
  const ls = fs.readdirSync(cwd);
  core.setOutput('contents', ls);
} catch(err) {
  core.setFailed(err.message);
}