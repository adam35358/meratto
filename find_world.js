const fs = require('fs');
const code = fs.readFileSync('C:/Users/user/Desktop/Project test/woufx_main.js', 'utf8');

['camera', 'globe', 'scene'].forEach(t => {
  let idx = 0;
  while ((idx = code.indexOf(t, idx)) !== -1) {
    console.log(`=== ${t} ===:`, code.substring(Math.max(0, idx - 80), Math.min(code.length, idx + 120)));
    idx += t.length;
  }
});
