const acorn = require('acorn');
const jsx = require('acorn-jsx');
const fs = require('fs');
const path = require('path');

function findComponent(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const parser = acorn.Parser.extend(jsx());
    
    const ast = parser.parse(code, { sourceType: 'module', ecmaVersion: 2020 });
    const componentAttributes = findComponentAttributes(ast);

    return componentAttributes;
}

function findComponentAttributes(ast) {
  let components = [];

  function walk(node) {
    if (!node) return;

    if (node.type === 'FunctionDeclaration' && node.id && node.id.name) {
      const componentName = node.id.name;

      if (!returnsJSX(node.body)) return;

      let componentAttributes = [];

      function walkComponentBody(bodyNode) {
        if (!bodyNode) return;

        if (bodyNode.type === 'JSXOpeningElement') {
          let elementId = null;
          let elementClass = null;
          let elementTestId = null;
          let elementListeners = [];
          let elementType = bodyNode.name.name;

          // Handle compound component names like Form.Group
          if (bodyNode.name.type === 'JSXMemberExpression') {
            elementType = getFullElementName(bodyNode.name);
          }

          // Check if the elementType is a component or HTML tag
          // Later, use white list to filter
          const isComponent = /^[A-Z]/.test(elementType);
          const tagType = isComponent ? 'Component' : 'HTML';
          const tagName = elementType;

          bodyNode.attributes.forEach(attr => {
            if (attr.name.name === 'id') {
              elementId = attr.value && attr.value.value;
            } else if (attr.name.name === 'className' || attr.name.name === 'class') {
              elementClass = attr.value && attr.value.value;
            } else if (attr.name.name == "data-testid") {
              elementTestId = attr.value && attr.value.value;
            } else if (attr.name.name.startsWith('on')) {
              elementListeners.push({
                event: attr.name.name,
                value: attr.value && attr.value.expression ? attr.value.expression.raw : attr.value && attr.value.value
              });
            }
          });

          componentAttributes.push({
            type: tagType,
            name: tagName,
            testId: elementTestId,
            id: elementId,
            class: elementClass,
            listeners: elementListeners
          });
        }

        for (const key in bodyNode) {
          if (bodyNode[key] && typeof bodyNode[key] === 'object') {
            walkComponentBody(bodyNode[key]);
          }
        }
      }

      walkComponentBody(node.body);
      components.push({ component: componentName, attributes: componentAttributes });
    }

    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        walk(node[key], node);
      }
    }
  }

  function getFullElementName(nameNode) {
    if (nameNode.type === 'JSXIdentifier') {
      return nameNode.name;
    } else if (nameNode.type === 'JSXMemberExpression') {
      return `${getFullElementName(nameNode.object)}.${getFullElementName(nameNode.property)}`;
    }
    return '';
  }

  function returnsJSX(bodyNode) {
    if (bodyNode.type === 'BlockStatement') {
      for (let stmt of bodyNode.body) {
        if (stmt.type === 'ReturnStatement' && stmt.argument && stmt.argument.type === 'JSXElement') {
          return true;
        }
      }
    }
    return false;
  }

  walk(ast);
  return components;
}

const components = JSON.parse(fs.readFileSync(path.join(__dirname, 'components.json'), 'utf-8'));
const elements = components.map(component => {
  const componentPath = path.join(__dirname, component);
  return findComponent(componentPath);
});

fs.writeFileSync(path.join(__dirname, 'componentsAnalysis.json'), JSON.stringify(elements, null, 2), 'utf-8');
console.log('Components analysis:', elements);