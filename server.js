const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("."));

app.post("/register", (req, res) => {

    const student = req.body;

    let students = [];

    if (fs.existsSync("student.json")) {
        students = JSON.parse(fs.readFileSync("student.json", "utf8"));
    }

    students.push(student);

    fs.writeFileSync(
        "student.json",
        JSON.stringify(students, null, 2)
    );

    res.json({
        message: "Registration successful"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});