const fs = require('fs');
const code = fs.readFileSync('C:/Users/user/Desktop/Project test/woufx_main.js', 'utf8');

const regex = /["'](\/assets\/[^"']+\.js)["']/g;
let match;
const chunks = new Set();
while ((match = regex.exec(code)) !== null) {
  chunks.add(match[1]);
}
console.log('Found chunks:', Array.from(chunks));
