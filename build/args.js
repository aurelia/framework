let yargs = require('yargs');

let argv = yargs.argv;
let validBumpTypes = 'major|minor|patch|prerelease'.split('|');
let bump = (argv.bump || 'patch').toLowerCase();

if (validBumpTypes.indexOf(bump) === -1) {
  throw new Error('Unrecognized bump "' + bump + '".');
}

module.exports = {
  bump: bump
};
