const fs = require('fs');
const path = require('path');

const componentsAnalysisFile = fs.readFileSync(path.join(__dirname, 'componentsAnalysis.json'), 'utf8');
const componentsAnalysis = JSON.parse(componentsAnalysisFile);

const testAnalysisFile = fs.readFileSync(path.join(__dirname, 'testsAnalysis.json'), 'utf8');
const testAnalysis = JSON.parse(testAnalysisFile);

// Function to calculate the number of tested and untested listeners
function calculateTestedListeners(componentsAnalysis, testAnalysis) {
  const result = [];

  componentsAnalysis.forEach(file => {
    const fileResult = {
      file: file.file,
      components: []
    };

    file.result.forEach(component => {
      const componentResult = {
        component: component.component,
        totalListeners: 0,
        testedListeners: 0,
        tested: [],
        notTested: []
      };

      component.attributes.forEach(attribute => {
        if (attribute.listeners && attribute.listeners.length > 0) {
          componentResult.totalListeners += attribute.listeners.length;

          attribute.listeners.forEach(listener => {
            const eventType = listener.event.replace("on", "").toLowerCase();
            const testExists = testAnalysis[0].some(test => 
              test.testId === attribute.testId && test.eventType === eventType
            );

            if (testExists) {
              componentResult.testedListeners += 1;
              componentResult.tested.push({
                type: attribute.type,
                name: attribute.name,
                event: listener.event
              });
            } else {
              componentResult.notTested.push({
                type: attribute.type,
                name: attribute.name,
                event: listener.event
              });
            }
          });
        }
      });

      const testRate = ((componentResult.testedListeners / (componentResult.totalListeners || 1)) * 100).toFixed(2);
      componentResult.testRate = `${testRate}%`;

      fileResult.components.push(componentResult);
    });

    result.push(fileResult);
  });

  return result;
}

const testedListeners = calculateTestedListeners(componentsAnalysis, testAnalysis);

const tableData = [];

testedListeners.forEach(fileItem => {
  fileItem.components.forEach(component => {
    const rowData = {
      "File Name": fileItem.file,
      "Component Name": component.component,
      "Total Listener Count": component.totalListeners,
      "Tested Listener Count": component.testedListeners,
      "Test Rate": component.testRate,
      "Tested Listener Detail": component.tested.map(listener => `${listener.type} ${listener.name} ${listener.event}`).join(", "),
      "Non-Tested Listener Detail": component.notTested.map(listener => `${listener.type} ${listener.name} ${listener.event}`).join(", ")
    };
    tableData.push(rowData);
  });
});

console.table(tableData);