const fs = require("fs");
const { execSync } = require("child_process");

// Current student data
const currentStudents = JSON.parse(
    fs.readFileSync("student.json", "utf8")
);

// Find the previous commit that changed student.json
let previousStudents = [];

try {
    const previousCommit = execSync(
        "git rev-list --max-count=1 HEAD^ -- student.json",
        { encoding: "utf8" }
    ).trim();

    if (previousCommit) {
        const previousData = execSync(
            `git show ${previousCommit}:student.json`,
            { encoding: "utf8" }
        );

        previousStudents = JSON.parse(previousData);
    }
} catch (error) {
    console.log("No previous student.json found. Treating all entries as new.");
}

// Compare entries using complete JSON content
const newStudents = currentStudents.filter(currentStudent => {
    return !previousStudents.some(previousStudent =>
        JSON.stringify(previousStudent) === JSON.stringify(currentStudent)
    );
});

console.log(`Total students: ${currentStudents.length}`);
console.log(`Previous students: ${previousStudents.length}`);
console.log(`New students: ${newStudents.length}`);

// Tell Jenkins whether there is anything new
fs.writeFileSync(
    "new-students.json",
    JSON.stringify(newStudents, null, 2)
);

// If there are no new students, don't create a new report
if (newStudents.length === 0) {
    console.log("No new student registrations found.");
    process.exit(0);
}

// Generate report
let report = "";

report += "# 🚀 Jenkins Student Registration Report\n\n";

report += `## New Registrations: ${newStudents.length}\n\n`;

let validCount = 0;
let invalidCount = 0;

newStudents.forEach((student, index) => {

    report += `## 👤 New Student ${index + 1}\n\n`;

    report += `**Name:** ${student.name || "Not provided"}\n\n`;

    report += `**Branch:** ${student.branch || "Not selected"}\n\n`;

    report += `**Email:** ${student.email || "Not provided"}\n\n`;

    const mobile = String(student.mobile || "");

    const maskedMobile =
        mobile.length >= 4
            ? "******" + mobile.slice(-4)
            : "******";

    report += `**Mobile:** ${maskedMobile}\n\n`;

    report += "**Password:** 🔒 Hidden\n\n";

    report += "### Validation Feedback\n\n";

    let valid = true;

    // Name
    if (student.name && student.name.trim() !== "") {
        report += "✅ Name is present\n\n";
    } else {
        report += "❌ Name is empty\n\n";
        valid = false;
    }

    // Mobile
    if (/^\d{10}$/.test(mobile)) {
        report += "✅ Mobile number has exactly 10 digits\n\n";
    } else {
        report += "❌ Mobile number must contain exactly 10 digits\n\n";
        valid = false;
    }

    // Email
    if (
        student.email &&
        student.email.includes("@")
    ) {
        report += "✅ Email contains @\n\n";
    } else {
        report += "❌ Invalid email\n\n";
        valid = false;
    }

    // Password
    if (
        student.password &&
        student.password.length >= 6
    ) {
        report += "✅ Password has at least 6 characters\n\n";
    } else {
        report += "❌ Password must have at least 6 characters\n\n";
        valid = false;
    }

    // Branch
    if (student.branch && student.branch !== "") {
        report += `✅ Branch selected: ${student.branch}\n\n`;
    } else {
        report += "❌ Branch not selected\n\n";
        valid = false;
    }

    if (valid) {
        report += "### Result: ✅ VALID\n\n";
        validCount++;
    } else {
        report += "### Result: ❌ INVALID\n\n";
        invalidCount++;
    }

    report += "---\n\n";
});

report += "## 📊 Summary\n\n";

report += "| Item | Count |\n";
report += "|---|---:|\n";
report += `| New Registrations | ${newStudents.length} |\n`;
report += `| Valid | ${validCount} |\n`;
report += `| Invalid | ${invalidCount} |\n\n`;

if (invalidCount === 0) {
    report += "🎉 **All new registrations are valid.**\n";
} else {
    report += "⚠️ **Some new registrations contain invalid data.**\n";
}

fs.writeFileSync("feedback.md", report);

console.log("Feedback report generated successfully.");