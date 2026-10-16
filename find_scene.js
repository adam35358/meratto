const fs = require('fs');
const code = fs.readFileSync('C:/Users/user/Desktop/Project test/woufx_main.js', 'utf8');

// Search for data-scene usages
const regex = /data-scene/g;
let match;
while ((match = regex.exec(code)) !== null) {
  console.log('data-scene:', code.substring(Math.max(0, match.index - 50), Math.min(code.length, match.index + 150)));
}

// Search for createElement('canvas')
const cIdx = code.indexOf('createElement("canvas")');
console.log('createElement canvas idx:', cIdx);
if (cIdx !== -1) {
  console.log(code.substring(cIdx - 50, cIdx + 200));
}
