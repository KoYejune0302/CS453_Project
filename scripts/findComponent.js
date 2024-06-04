const acorn = require('acorn');
const jsx = require('acorn-jsx');
const fs = require('fs');

function findComponent(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const parser = acorn.Parser.extend(jsx());
    
    const ast = parser.parse(code, { sourceType: 'module', ecmaVersion: 2020 });
    const componentAttributes = findComponentAttributes(ast);

    return JSON.stringify(componentAttributes, null, 2);
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
          let elementListeners = [];
          let elementType = bodyNode.name.name;

          bodyNode.attributes.forEach(attr => {
            if (attr.name.name === 'id') {
              elementId = attr.value && attr.value.value;
            } else if (attr.name.name === 'className' || attr.name.name === 'class') {
              elementClass = attr.value && attr.value.value;
            } else if (attr.name.name.startsWith('on')) {
              elementListeners.push({
                event: attr.name.name,
                value: attr.value && attr.value.expression ? attr.value.expression.raw : attr.value && attr.value.value
              });
            }
          });

          componentAttributes.push({
            type: elementType,
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

// console.log(findComponent("src/components/MyComponent.js"))