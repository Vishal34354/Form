const fs = require("fs");

const results = JSON.parse(
    fs.readFileSync("test-results.json", "utf8")
);

const total = results.numTotalTests;
const passed = results.numPassedTests;
const failed = results.numFailedTests;

let report = "";

report += "# Jenkins Test Feedback Report\n\n";

report += `**Status:** ${
    failed === 0 ? "✅ SUCCESS" : "❌ FAILED"
}\n\n`;

report += `- Total Tests: ${total}\n`;
report += `- Passed: ${passed}\n`;
report += `- Failed: ${failed}\n`;
report += `- Test Suites: ${results.numTotalTestSuites}\n\n`;

if (failed > 0) {

    report += "## Failed Tests\n\n";

    results.testResults.forEach(file => {

        file.assertionResults.forEach(test => {

            if (test.status === "failed") {
                report += `- ❌ ${test.title}\n`;
            }

        });

    });

} else {

    report += "## Result\n\n";
    report += "All 10 tests passed successfully. 🎉\n";

}

fs.writeFileSync("feedback.md", report);

console.log("Feedback report generated.");