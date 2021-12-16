const axios = require('axios');

// Make this an action input
const baseUrl = 'https://gonfalon-3001-gonfalon-pr-15379.launchdarkly.okteto.dev';
const endpoint = (project, env, flag) => `${baseUrl}/api/v2/projects/${project}/environments/${env}/flags/${flag}/sync`;

const makeSyncRequest = async (project, env, flag, newConfig, oldConfig) => {
  const data = {
    commitMessage: 'This is a test', // Change this obviously
    preview: false,
    newConfig,
    oldConfig
  };
  
  return await axios({
    method: 'POST',
    url: endpoint(project, env, flag),
    data,
    headers: {
      'Authorization': process.env.LD_API_KEY,
      'Content-Type': 'application/json',
      'LD-API-Version': 'beta'
    }
  });
} 

module.exports = {
  makeSyncRequest
}
