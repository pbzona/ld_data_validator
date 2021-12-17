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

exports.validate = (commits) => {
  // Validate that the current push did not come from an automated user
  try {
    for (let commit of commits) {
      let committerIsAutomated = (
        commit.author.name === automationUser.name
      )

      if (committerIsAutomated) {
        console.log('One of these commits came from LD2Git - exiting now');
        console.warn('If you have somehow included human-generated commits in this push, revert them and push again');
        process.exit(0);
      } else {
        console.log(`Validation passed for: ${commit.author.name} - yay!`);
      }
    }

  } catch (err) {
    console.error(`Error: ${err}`);
  }
}