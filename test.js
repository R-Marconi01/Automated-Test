const fs = require('fs');
const jest = require('jest');
const { format } = require('date-fns');

// Function to read test cases from a specified location or file
function readTestCases(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading test cases:', error.message);
    return [];
  }
}

// Function to execute test cases using Jest
async function executeTestCases(testCases) {
  try {
    await jest.run(testCases);
  } catch (error) {
    console.error('Error executing test cases:', error.message);
  }
}

// Function to generate an HTML report based on Jest results
function generateReport(results) {
  const currentDate = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  const reportFileName = `test_report_${currentDate}.html`;
  let reportContent = '<h1>Test Report</h1>';

  results.testResults.forEach((testCase) => {
    reportContent += `<h2>${testCase.testFilePath}</h2>`;
    testCase.testResults.forEach((result) => {
      const status = result.status === 'passed' ? 'Passed' : 'Failed';
      reportContent += `<p>${result.title}: ${status}</p>`;
    });
  });

  try {
    fs.writeFileSync(reportFileName, reportContent);
    console.log(`Test report generated: ${reportFileName}`);
  } catch (error) {
    console.error('Error generating test report:', error.message);
  }
}

// Main function to orchestrate test case execution and reporting
function runTestSuite(filePath) {
  const testCases = readTestCases(filePath);
  if (testCases.length === 0) {
    console.error('No test cases found. Exiting...');
    return;
  }

  executeTestCases(testCases)
    .then((results) => {
      generateReport(results);
    })
    .catch((error) => {
      console.error('Error running test suite:', error.message);
    });
}

// Example usage
const testCasesFilePath = 'test_cases.json';
runTestSuite(testCasesFilePath);
