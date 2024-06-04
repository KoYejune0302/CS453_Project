// scripts/analyzeComponent.js
const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function analyzeComponent(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const ast = babelParser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  const elements = [];

  traverse(ast, {
    JSXElement(path) {
      const openingElement = path.node.openingElement;
      const tagName = openingElement.name.name;
      const attributes = openingElement.attributes.map(attr => ({
        name: attr.name.name,
        value: attr.value ? attr.value.value : null,
      }));

      elements.push({ tagName, attributes });
    },
  });

  return elements;
}

const componentPath = path.join(__dirname, '../src/components/MyComponent.js');
const elements = analyzeComponent(componentPath);
fs.writeFileSync(path.join(__dirname, 'componentAnalysis.json'), JSON.stringify(elements, null, 2), 'utf-8');
console.log('Component analysis:', elements);
