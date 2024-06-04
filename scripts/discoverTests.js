// scripts/discoverComponents.js
const fs = require('fs');
const path = require('path');

function discoverTests(dir, tests = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    // console.log('filePath:', filePath);
    // console.log(stat.isFile());
    // console.log(/\.(js|jsx|ts|tsx)$/.test(file));

    if (stat.isDirectory()) {
      discoverTests(filePath, components);
    } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(file) && /\.test\.(js|jsx|ts|tsx)$/.test(file)){
      // add relative path to the test file
      tests.push(path.join('../src/', filePath.replace(path.join(__dirname, '../src/'), '') ));
    }
  });

  return tests;
}

const tests = discoverTests(path.join(__dirname, '../src/__tests__/'));
fs.writeFileSync(path.join(__dirname, 'tests.json'), JSON.stringify(tests, null, 2));
console.log('Discovered tests:', tests);
