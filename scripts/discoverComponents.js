// scripts/discoverComponents.js
const fs = require('fs');
const path = require('path');

function discoverComponents(dir, components = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    // console.log('filePath:', filePath);
    // console.log(stat.isFile());
    // console.log(/\.(js|jsx|ts|tsx)$/.test(file));

    if (stat.isDirectory()) {
      discoverComponents(filePath, components);
    } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(file) && !/\.test\.(js|jsx|ts|tsx)$/.test(file)) {
      components.push(path.join('../src/', filePath.replace(path.join(__dirname, '../src/'), '')
      ));
    }
  });

  return components;
}

const components = discoverComponents(path.join(__dirname, '../src/components'));
fs.writeFileSync(path.join(__dirname, 'components.json'), JSON.stringify(components, null, 2));
console.log('Discovered components:', components);
