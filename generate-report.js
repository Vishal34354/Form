const fs = require("fs");
const { execSync } = require("child_process");

// ==================================================
// 1. READ CURRENT STUDENT DATA
// ==================================================

const currentStudents = JSON.parse(
    fs.readFileSync("student.json", "utf8")
);

console.log(`Current students: ${currentStudents.length}`);


// ==================================================
// 2. READ PREVIOUS COMMIT'S student.json
// ==================================================

let previousStudents = [];

try {

    const previousFile = execSync(
        "git show HEAD~1:student.json",
        {
            encoding: "utf8"
        }
    );

    previousStudents = JSON.parse(previousFile);

} catch (error) {

    console.log(
        "Could not read student.json from previous commit."
    );

    process.exit(1);
}

console.log(
    `Previous students: ${previousStudents.length}`
);


// ==================================================
// 3. FIND NEW STUDENTS
// ==================================================
//
// A student is considered NEW if the complete student
// object does not already exist in the previous commit.
//
// ==================================================

const newStudents = currentStudents.filter(currentStudent => {

    return !previousStudents.some(previousStudent => {

        return (
            currentStudent.name === previousStudent.name &&
            currentStudent.mobile === previousStudent.mobile &&
            currentStudent.email === previousStudent.email &&
            currentStudent.branch === previousStudent.branch
        );

    });

});


console.log(
    `New students: ${newStudents.length}`
);


// ==================================================
// 4. NO NEW STUDENTS
// ==================================================

if (newStudents.length === 0) {

    console.log(
        "No new student registrations found."
    );

    // Keep an empty file so Jenkins can check it
    fs.writeFileSync(
        "new-students.json",
        "[]"
    );

    process.exit(0);
}


// ==================================================
// 5. SAVE NEW STUDENTS
// ==================================================

fs.writeFileSync(
    "new-students.json",
    JSON.stringify(newStudents, null, 2)
);


// ==================================================
// 6. GENERATE FEEDBACK REPORT
// ==================================================

let report = "";

report += "# 🚀 Jenkins Student Registration Report\n\n";

report += `## New Registrations: ${newStudents.length}\n\n`;

report += "---\n\n";


let validCount = 0;
let invalidCount = 0;


// ==================================================
// 7. VALIDATE EACH NEW STUDENT
// ==================================================

newStudents.forEach((student, index) => {

    report += `## 👤 Student ${index + 1}\n\n`;

    // ----------------------------------------------
    // NAME
    // ----------------------------------------------

    report += `**Name:** ${
        student.name || "Not provided"
    }\n\n`;


    // ----------------------------------------------
    // MOBILE
    // ----------------------------------------------

    const mobile = String(
        student.mobile || ""
    );

    const maskedMobile =
        mobile.length >= 4
            ? "******" + mobile.slice(-4)
            : "******";

    report += `**Mobile:** ${maskedMobile}\n\n`;


    // ----------------------------------------------
    // EMAIL
    // ----------------------------------------------

    report += `**Email:** ${
        student.email || "Not provided"
    }\n\n`;


    // ----------------------------------------------
    // BRANCH
    // ----------------------------------------------

    report += `**Branch:** ${
        student.branch || "Not selected"
    }\n\n`;


    // ----------------------------------------------
    // PASSWORD
    // ----------------------------------------------

    report += "**Password:** 🔒 Hidden\n\n";

    report += "### Validation Feedback\n\n";


    let valid = true;


    // ==================================================
    // NAME VALIDATION
    // ==================================================

    if (
        student.name &&
        student.name.trim() !== ""
    ) {

        report +=
            "✅ Name is present\n\n";

    } else {

        report +=
            "❌ Name is empty\n\n";

        valid = false;
    }


    // ==================================================
    // MOBILE VALIDATION
    // ==================================================

    if (/^\d{10}$/.test(mobile)) {

        report +=
            "✅ Mobile number contains exactly 10 digits\n\n";

    } else {

        report +=
            "❌ Mobile number must contain exactly 10 digits\n\n";

        valid = false;
    }


    // ==================================================
    // PASSWORD VALIDATION
    // ==================================================

    const password = String(
        student.password || ""
    );

    if (password.length >= 6) {

        report +=
            "✅ Password contains at least 6 characters\n\n";

    } else {

        report +=
            "❌ Password must contain at least 6 characters\n\n";

        valid = false;
    }


    // ==================================================
    // EMAIL VALIDATION
    // ==================================================

    const email = String(
        student.email || ""
    );

    if (email.includes("@")) {

        report +=
            "✅ Email contains @\n\n";

    } else {

        report +=
            "❌ Email must contain @\n\n";

        valid = false;
    }


    // ==================================================
    // BRANCH VALIDATION
    // ==================================================

    if (
        student.branch &&
        student.branch.trim() !== ""
    ) {

        report +=
            `✅ Branch selected: ${student.branch}\n\n`;

    } else {

        report +=
            "❌ Branch is not selected\n\n";

        valid = false;
    }


    // ==================================================
    // RESULT
    // ==================================================

    if (valid) {

        report +=
            "### Result: ✅ VALID REGISTRATION\n\n";

        validCount++;

    } else {

        report +=
            "### Result: ❌ INVALID REGISTRATION\n\n";

        invalidCount++;
    }


    report += "---\n\n";

});


// ==================================================
// 8. SUMMARY
// ==================================================

report += "# 📊 Summary\n\n";

report += "| Item | Count |\n";
report += "|---|---:|\n";

report +=
    `| New Registrations | ${newStudents.length} |\n`;

report +=
    `| Valid Registrations | ${validCount} |\n`;

report +=
    `| Invalid Registrations | ${invalidCount} |\n\n`;


if (invalidCount === 0) {

    report +=
        "## 🎉 All new registrations are valid!\n";

} else {

    report +=
        "## ⚠️ Some new registrations contain errors.\n\n";

    report +=
        "Please review the validation feedback above.\n";
}


// ==================================================
// 9. WRITE REPORT
// ==================================================

fs.writeFileSync(
    "feedback.md",
    report
);

console.log(
    "Feedback report generated successfully."
);