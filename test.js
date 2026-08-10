const validate = require("./student");

test("Valid Form", () => {
    expect(validate({
        name: "John",
        mobile: "9876543210",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "CSE"
    })).toBe("Success");
});

test("Empty Name", () => {
    expect(validate({
        name: "",
        mobile: "9876543210",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "CSE"
    })).toBe("Name Required");
});

test("Mobile Less Than 10 Digits", () => {
    expect(validate({
        name: "John",
        mobile: "98765",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "CSE"
    })).toBe("Invalid Mobile");
});

test("Mobile More Than 10 Digits", () => {
    expect(validate({
        name: "John",
        mobile: "987654321011",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "CSE"
    })).toBe("Invalid Mobile");
});

test("Password Less Than 6 Characters", () => {
    expect(validate({
        name: "John",
        mobile: "9876543210",
        password: "123",
        email: "john@gmail.com",
        branch: "CSE"
    })).toBe("Password Too Short");
});

test("Email Without @", () => {
    expect(validate({
        name: "John",
        mobile: "9876543210",
        password: "abcdef",
        email: "gmail.com",
        branch: "CSE"
    })).toBe("Invalid Email");
});

test("Branch Not Selected", () => {
    expect(validate({
        name: "John",
        mobile: "9876543210",
        password: "abcdef",
        email: "john@gmail.com",
        branch: ""
    })).toBe("Select Branch");
});

test("Name Contains Only Spaces", () => {
    expect(validate({
        name: "   ",
        mobile: "9876543210",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "IT"
    })).toBe("Name Required");
});

test("Mobile Contains Letters", () => {
    expect(validate({
        name: "John",
        mobile: "98765abcde",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "IT"
    })).toBe("Invalid Mobile");
});

test("Another Valid User", () => {
    expect(validate({
        name: "Alice",
        mobile: "9999999999",
        password: "password",
        email: "alice@test.com",
        branch: "ECE"
    })).toBe("Success");
});