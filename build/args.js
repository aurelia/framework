var yargs = require('yargs');

var argv = yargs.argv,
    validBumpTypes = "major|minor|patch|prerelease".split("|"),
    bump = (argv.bump || 'patch').toLowerCase();

if(validBumpTypes.indexOf(bump) === -1) {
  throw new Error('Unrecognized bump "' + bump + '".');
}

module.exports = {
  bump: bump
};
