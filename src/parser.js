const path = require('path');

// Tells whether a file is a flag configuration file or not
const isFlagConfigFile = (pathToFile) => {
  return path.parse(pathToFile).dir.split('/')[0] == 'projects';
}

const parseFlagKey = (pathToFile) => {
  const flagConfigDir = path.parse(pathToFile).dir.split('/');
  return flagConfigDir[flagConfigDir.length - 1];
}

const parseFlagEnv = (pathToFile) => {
  const flagConfigName = path.parse(pathToFile).name;
  let flagEnv;
  if ((flagConfigName == 'core-metadata') || (flagConfigName == 'flag')) {
    flagEnv = 'global'; // early return
  } else {
    flagEnv = flagConfigName.replace("env-","");
  }
  return flagEnv;
}

const parseFlagProject = (pathToFile) => {
  return path.parse(pathToFile).dir.split('/')[1];
}

module.exports = {
  isFlagConfigFile,
  parseFlagKey,
  parseFlagEnv,
  parseFlagProject,
}
