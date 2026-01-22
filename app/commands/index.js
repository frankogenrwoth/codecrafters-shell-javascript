const { executeEcho } = require('./echo');
const { executeType } = require('./type');
const { executeExternalCommand } = require('./run');
const { executePwd } = require('./pwd');
const { executeCd } = require('./cd');

module.exports = {
  executeEcho,
  executeType,
  executeExternalCommand,
  executePwd,
  executeCd
};
