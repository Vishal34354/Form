const validate = require("./student");

test("Valid Form", () => {
    expect(validate({
        name: "John",
        mobile: "9876543210",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "CSE"
    })).toBe("Failed");
});

test("Empty Name", () => {
    expect(validate({
        name: "",
        mobile: "9876543210",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "CSE"
    })).toBe("Success");
});

test("Mobile Less Than 10 Digits", () => {
    expect(validate({
        name: "John",
        mobile: "98765",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "CSE"
    })).toBe("Success");
});

test("Mobile More Than 10 Digits", () => {
    expect(validate({
        name: "John",
        mobile: "987654321011",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "CSE"
    })).toBe("Success");
});

test("Password Less Than 6 Characters", () => {
    expect(validate({
        name: "John",
        mobile: "9876543210",
        password: "123",
        email: "john@gmail.com",
        branch: "CSE"
    })).toBe("Success");
});

test("Email Without @", () => {
    expect(validate({
        name: "John",
        mobile: "9876543210",
        password: "abcdef",
        email: "gmail.com",
        branch: "CSE"
    })).toBe("Success");
});

test("Branch Not Selected", () => {
    expect(validate({
        name: "John",
        mobile: "9876543210",
        password: "abcdef",
        email: "john@gmail.com",
        branch: ""
    })).toBe("Success");
});

test("Name Contains Only Spaces", () => {
    expect(validate({
        name: "   ",
        mobile: "9876543210",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "IT"
    })).toBe("Success");
});

test("Mobile Contains Letters", () => {
    expect(validate({
        name: "John",
        mobile: "98765abcde",
        password: "abcdef",
        email: "john@gmail.com",
        branch: "IT"
    })).toBe("Success");
});

test("Another Valid User", () => {
    expect(validate({
        name: "Alice",
        mobile: "9999999999",
        password: "password",
        email: "alice@test.com",
        branch: "ECE"
    })).toBe("Failed");
});