const path = require('path');
const fs = require('fs');

exports.readFlagConfig = (path) => {
  // Returns a json object ready to use
  return JSON.parse(fs.readFileSync(path).toString());
}

// Tells whether a file is a flag configuration file or not
exports.isFlagConfigFile = (filePath) => {
  return path.parse(filePath).dir.split('/')[0] == 'projects'
}