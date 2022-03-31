// @ts-check
const path = require('path').resolve(__dirname, '../bower.json');
const npmVersion = require('../package.json').version;
const bowerContent = require('../bower.json');
bowerContent.version = npmVersion;

require('fs').writeFileSync(path, JSON.stringify(bowerContent, undefined, 2), { encoding: 'utf-8' });
