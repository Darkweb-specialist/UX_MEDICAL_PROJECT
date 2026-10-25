const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

let filesCount = 0;

function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkDir(full);
    } else if (f.endsWith('.js') && !full.includes('node_modules')) {
      filesCount++;
      const code = fs.readFileSync(full, 'utf8');
      babel.parseSync(code, {
        filename: full,
        presets: ['babel-preset-expo'],
        configFile: false,
        babelrc: false,
      });
      console.log('✓ Valid:', path.relative(process.cwd(), full));
    }
  }
}

try {
  // Test root App.js
  babel.parseSync(fs.readFileSync('App.js', 'utf8'), {
    filename: 'App.js',
    presets: ['babel-preset-expo'],
    configFile: false,
    babelrc: false,
  });
  console.log('✓ Valid: App.js');
  filesCount++;

  checkDir(path.join(process.cwd(), 'src'));
  console.log(`\nAll ${filesCount} JavaScript source files parsed and validated successfully!`);
} catch (err) {
  console.error('Syntax error:', err.message);
  process.exit(1);
}
