const fs = require('fs');
const path = require('path');

exports.traverse = (fn) => {
  const projectsDir = path.join(__dirname, '..', 'projects')
  const projects = fs.readdirSync(projectsDir);
  
  for (let project of projects) {
    const flags = fs.readdirSync(path.join(projectsDir, project));
    for (let flag of flags) {
      const configs = fs.readdirSync(path.join(projectsDir, project, flag));
      for (let config of configs) {
        const pathToConfigFile = path.join(projectsDir, project, flag, config);
        fn(pathToConfigFile);
      }
    }
  }
}

exports.validate = (pathToFile) => {
  // Do some validation on the current file
  console.log(fs.readFileSync(pathToFile));
}