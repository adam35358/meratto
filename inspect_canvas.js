const fs = require('fs');
const code = fs.readFileSync('C:/Users/user/Desktop/Project test/WorldCanvas.js', 'utf8');

console.log('File size:', code.length);
// Check for Three.js, shaders, or canvas rendering
const terms = ['PerspectiveCamera', 'Scene', 'WebGLRenderer', 'Mesh', 'ShaderMaterial', 'camera', 'scroll', 'scene', 'rotation', 'zoom', 'fov'];
terms.forEach(t => {
  let count = 0, pos = 0;
  while ((pos = code.indexOf(t, pos)) !== -1) { count++; pos += t.length; }
  console.log(t, count);
});
