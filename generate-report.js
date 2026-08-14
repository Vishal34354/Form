const fs = require("fs");

const results = JSON.parse(
    fs.readFileSync("test-results.json", "utf8")
);

const students = JSON.parse(
    fs.readFileSync("student.json", "utf8")
);

const total = results.numTotalTests;
const passed = results.numPassedTests;
const failed = results.numFailedTests;

const buildNumber = process.env.BUILD_NUMBER || "Local";

const student = students.length > 0
    ? students[students.length - 1]
    : null;

let report = "";

report += "# 🚀 Jenkins Student Registration Report\n\n";

report += "## Build Information\n\n";

report += "| Item | Result |\n";
report += "|---|---|\n";
report += `| Build | #${buildNumber} |\n`;
report += `| Status | ${failed === 0 ? "✅ SUCCESS" : "❌ FAILED"} |\n`;
report += `| Total Tests | ${total} |\n`;
report += `| Passed | ${passed} |\n`;
report += `| Failed | ${failed} |\n\n`;

report += "---\n\n";

if (student) {

    let mobile = String(student.mobile || "");

    let maskedMobile = mobile.length >= 4
        ? "******" + mobile.slice(-4)
        : "******";

    report += "## 👤 Latest Student Registration\n\n";

    report += `**Name:** ${student.name}\n\n`;
    report += `**Branch:** ${student.branch}\n\n`;
    report += `**Email:** ${student.email}\n\n`;
    report += `**Mobile:** ${maskedMobile}\n\n`;
    report += `**Password:** 🔒 Hidden\n\n`;

} else {

    report += "## 👤 Latest Student Registration\n\n";
    report += "No student registration data found.\n\n";
}

report += "---\n\n";

report += "## 🧪 Automated Test Results\n\n";

report += "| Test | Status |\n";
report += "|---|---|\n";

results.testResults.forEach(file => {

    file.assertionResults.forEach(test => {

        let status = test.status === "passed"
            ? "✅ PASS"
            : "❌ FAIL";

        report += `| ${test.title} | ${status} |\n`;
    });

});

report += "\n---\n\n";

report += "## 📋 Final Feedback\n\n";

if (failed === 0) {

    report += "🎉 **All 10 automated validation tests passed successfully.**\n\n";
    report += "The registration validation system is working correctly.\n";

} else {

    report += "⚠️ **Automated validation tests failed.**\n\n";
    report += "Please check the failed tests before accepting the latest changes.\n";
}

fs.writeFileSync("feedback.md", report);

console.log("Professional feedback report generated.");