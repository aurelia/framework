var yargs = require('yargs');

var argv = yargs.argv;

var validBumptypes = "major|minor|patch|prerelease".split("|");

var bumpType = (argv.bumptype || 'patch').toLowerCase();

if( validBumptypes.indexOf(bumpType) < 0) {
  throw "Unrecognized bumptype '" + bumpType + "'.";
}

module.exports = {
  versionBumpType: bumpType
};
