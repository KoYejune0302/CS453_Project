// scripts/generateRandomTests.js
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const analysis = require('./componentAnalysis.json');

const generateTestCases = (componentPath, analysis) => {
  const componentName = path.basename(componentPath, path.extname(componentPath));
  const testDir = path.join(path.dirname(componentPath), '__tests__');
  const testFile = path.join(testDir, `${componentName}.test.js`);

  const testImports = `
import React from 'react';
import { render, screen } from '@testing-library/react';
import ${componentName} from '../${componentName}';
`;

  const testCases = analysis.map((element, index) => `
test('renders ${componentName} component with ${element.tagName} tag ${index + 1}', () => {
  render(<${componentName} />);
  const element = screen.getBy${element.tagName}(${element.attributes.length > 0 ? `/${element.attributes[0].value}/i` : ''});
  expect(element).toBeInTheDocument();
});
`).join('\n');

  const testContent = testImports + testCases;

  const formattedTestContent = prettier.format(testContent, { parser: 'babel' });

  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }

  fs.writeFileSync(testFile, formattedTestContent);
  console.log(`Generated test for ${componentName}`);
};

const componentPath = path.join(__dirname, '../src/components/MyComponent.js');
generateTestCases(componentPath, analysis);
