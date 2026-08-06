function validateForm(data) {

    if (data.name.trim() === "")
        return "Name Required";

    if (!/^\d{10}$/.test(data.mobile))
        return "Invalid Mobile";

    if (data.password.length < 6)
        return "Password Too Short";

    if (!data.email.includes("@"))
        return "Invalid Email";

    if (data.branch === "")
        return "Select Branch";

    return "Success";
}

module.exports = validateForm;