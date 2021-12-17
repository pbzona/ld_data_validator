const axios = require('axios');
const core = require('@actions/core');

// Make this an action input
const baseUrl = process.env.INPUT_BASEURL
const endpoint = (project, env, flag) => `${baseUrl}/api/v2/projects/${project}/environments/${env}/flags/${flag}/sync`;

const makeSyncRequest = async (project, env, flag, newConfig, oldConfig) => {
  const data = {
    commitMessage: 'This is a test', // Change this obviously
    preview: false,
    newConfig,
    oldConfig
  };

  const config = {
    method: 'POST',
    url: endpoint(project, env, flag),
    data,
    headers: {
      'Authorization': process.env.LD_API_KEY,
      'Content-Type': 'application/json',
      'LD-API-Version': 'beta'
    }
  }
  console.log(config);
  
  const response = await axios(config).catch(function (error) {
    let errorLogs = [];
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorLogs.push("Server responded with an error",
                      error.response.data, 
                      error.response.status, 
                      error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      errorLogs.push("No response received for this request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      errorLogs.push('Error', error.message);
    }
    errorLogs.push(error.config, response);
    core.setFailed(errorLogs.map(JSON.stringify).join('\n\n'));
  });
  return response;
}

module.exports = {
  makeSyncRequest
}
