const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { readFlagConfig, isFlagConfigFile } = require('./util');

exports.traverse = (fn) => {
  const projectsDir = path.join(process.cwd(), 'projects')
  const projects = fs.readdirSync(projectsDir);
  
  for (let project of projects) {
    console.log('PROJECT:', project);
    const flags = fs.readdirSync(path.join(projectsDir, project, 'flags'));
    for (let flag of flags) {
      console.log('FLAG:', flag);
      const configs = fs.readdirSync(path.join(projectsDir, project, 'flags', flag));
      for (let config of configs) {
        console.log('CONFIG', config);
        const pathToConfigFile = path.join(projectsDir, project, 'flags', flag, config);
        console.log(pathToConfigFile);
        fn(pathToConfigFile);
      }
    }
  }
}

exports.validate = (pathToFile) => {
  // Do some validation on the current file
  try {
    // Reads the file into an operable json object
    const configJson = readFlagConfig(pathToFile);
    console.log(configJson);
  } catch (err) {
    console.error('Error reading config file: ', err);
  }
}

exports.getFilesChangedInLastCommit = () => {
  const filesChanged = execSync('git diff --name-only HEAD HEAD~1');
  return filesChanged.toString().split('\n');
}

exports.getModifiedFlags = (updatedFiles) => {
  const flags = updatedFiles.filter(file => {
      return isFlagConfigFile(file);
    }).map(file => {
      const flagConfig = readFlagConfig(file);
      return flagConfig.key;
    });

  return [...new Set(flags)]; // Removes duplicates since each flag dir could have multiple changed files
}