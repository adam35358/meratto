const fs = require('fs');
const code = fs.readFileSync('C:/Users/user/Desktop/Project test/woufx_main.js', 'utf8');

// Find all occurrences of "canvas" case-insensitive
let idx = 0;
while ((idx = code.toLowerCase().indexOf('canvas', idx)) !== -1) {
  console.log('canvas match:', code.substring(Math.max(0, idx - 40), Math.min(code.length, idx + 100)));
  idx += 6;
}
