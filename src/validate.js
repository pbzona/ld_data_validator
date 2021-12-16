const fs = require('fs');
const path = require('path');

const { automationUser } = require('./automationUser');

exports.traverse = (fn) => {
  const projectsDir = path.join(process.cwd(), 'projects')
  const projects = fs.readdirSync(projectsDir);
  
  for (let project of projects) {
    //console.log('PROJECT:', project);
    const flags = fs.readdirSync(path.join(projectsDir, project, 'flags'));
    for (let flag of flags) {
      //console.log('FLAG:', flag);
      const configs = fs.readdirSync(path.join(projectsDir, project, 'flags', flag));
      for (let config of configs) {
        //console.log('CONFIG', config);
        const pathToConfigFile = path.join(projectsDir, project, 'flags', flag, config);
        //console.log(pathToConfigFile);
        fn(pathToConfigFile);
      }
    }
  }
}

exports.validate = (event) => {
  // Validate that the current push did not come from an automated user
  try {
    for (let commit of event.commits) {
      let committerIsAutomated = (
        commit.author.email === automationUser.email &&
        commit.author.name === automationUser.name &&
        commit.author.username === automationUser.username
      )

      if (committerIsAutomated) {
        process.exit(0);
      }
    }

  } catch (err) {
    console.error(`Error reading config file (${pathToFile}): ${err}`);
  }
}