const core = require('@actions/core');
const github = require('@actions/github');

try {
  const time = new Date().toTimeString();
  core.setOutput('time', time);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  core.setOutput('event', payload);
} catch(err) {
  core.setFailed(err.message);
}