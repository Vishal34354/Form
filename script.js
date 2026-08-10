document.getElementById("myForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        mobile: document.getElementById("mobile").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
        branch: document.getElementById("branch").value
    };

    if (data.name.trim() === "") {
        document.getElementById("message").innerHTML = "Name Required";
        return;
    }

    if (!/^\d{10}$/.test(data.mobile)) {
        document.getElementById("message").innerHTML = "Invalid Mobile";
        return;
    }

    if (data.password.length < 6) {
        document.getElementById("message").innerHTML = "Password Too Short";
        return;
    }

    if (!data.email.includes("@")) {
        document.getElementById("message").innerHTML = "Invalid Email";
        return;
    }

    if (data.branch === "") {
        document.getElementById("message").innerHTML = "Select Branch";
        return;
    }

    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    document.getElementById("message").innerHTML = result.message;

    document.getElementById("myForm").reset();
});