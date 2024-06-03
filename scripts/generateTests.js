// scripts/generateTests.js
const fs = require('fs');
const path = require('path');

const components = require('./components.json');

components.forEach(componentPath => {
  const componentName = path.basename(componentPath, path.extname(componentPath));
  const testDir = path.join(path.dirname(componentPath), '__tests__');
  const testFile = path.join(testDir, `${componentName}.test.js`);

  const testContent = `
import React from 'react';
import { render, screen } from '@testing-library/react';
import ${componentName} from '../${componentName}';

test('renders ${componentName} component', () => {
  render(<${componentName} />);
  // Add more specific tests here
  // Example: const element = screen.getByText(/some text/i);
  // expect(element).toBeInTheDocument();
});
`;

  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }

  fs.writeFileSync(testFile, testContent);
  console.log(`Generated test for ${componentName}`);
});
