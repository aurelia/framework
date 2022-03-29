const path = require('path').resolve(__dirname, 'api.json');
const content = JSON.stringify(require('./api.json'));

require('fs').writeFileSync(path, content, { encoding: 'utf-8' });
