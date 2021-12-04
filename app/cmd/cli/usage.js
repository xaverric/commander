const commandLineUsage = require('command-line-usage');
const { cmdArgumentsDefinition } = require('./arguments.js');

const usageDefinition = [
  {
    header: 'uuCommander CLI',
    content: 'An amazing command line tool allowing you to call commands with a list of dtoIn on the commands which does not accept the dtoIn list.'
  },
  {
    header: 'Synopsis',
    content: '$ uucommander <command> <command parameters>'
  },
  {
    header: 'Commands',
    content: [
      { name: 'help', summary: 'Display this help.' },
      { name: 'use', summary: 'Displays loaded configuration to the user.' },
      { name: 'run', summary: 'Displays list of deployed uuApps.' }
    ]
  },
  {
    header: 'Parameters',
    optionList: cmdArgumentsDefinition
  }
];

const usage = commandLineUsage(usageDefinition);

module.exports = {
  usage
};
