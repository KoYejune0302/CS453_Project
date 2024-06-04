// scripts/analyzeTest.js
const fs = require("fs");
const path = require("path");
const babelParser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function analyzeTest(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  const ast = babelParser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const events = [];

  traverse(ast, {
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      if (
        callee.type === "MemberExpression" &&
        (callee.property.name === "change" || callee.property.name === "click")
      ) {
        let testId = null;

        if (
          args[0] &&
          args[0].type === "CallExpression" &&
          args[0].callee.name === "getByTestId"
        ) {
          testId = args[0].arguments[0].value;
        }

        if (testId) {
          events.push({ testId, eventType: callee.property.name });
        }
      }
    },
  });

  return events;
}


const tests = JSON.parse(fs.readFileSync(path.join(__dirname, 'tests.json'), 'utf-8'));
const elements = tests.map(test => {
  const testPath = path.join(__dirname, test);
  return analyzeTest(testPath);
});

fs.writeFileSync(path.join(__dirname, 'testsAnalysis.json'), JSON.stringify(elements, null, 2), 'utf-8');
console.log('Tests analysis:', elements);