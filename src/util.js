const fs = require('fs');

exports.readFlagConfig = (path) => {
  // Returns a json object ready to use
  return JSON.parse(fs.readFileSync(path).toString());
}