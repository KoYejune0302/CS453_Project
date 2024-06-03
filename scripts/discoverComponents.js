// scripts/discoverComponents.js
const fs = require('fs');
const path = require('path');

function discoverComponents(dir, components = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    console.log('filePath:', filePath);
    console.log(stat.isFile());
    console.log(/\.(js|jsx|ts|tsx)$/.test(file));

    if (stat.isDirectory()) {
      discoverComponents(filePath, components);
    } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
      const component = { fileDir: filePath, componentName: path.basename(file, path.extname(file))};
      components.push(component);
    }
  });

  return components;
}

const components = discoverComponents(path.join(__dirname, '../src'));
fs.writeFileSync(path.join(__dirname, 'components.json'), JSON.stringify(components, null, 2));
console.log('Discovered components:', components);
