document.getElementById("myForm").addEventListener("submit",function(e){

    e.preventDefault();

    const data={
        name:document.getElementById("name").value,
        mobile:document.getElementById("mobile").value,
        password:document.getElementById("password").value,
        email:document.getElementById("email").value,
        branch:document.getElementById("branch").value
    };

    let message="";

    if(data.name.trim()=="")
        message="Name Required";
    else if(!/^\d{10}$/.test(data.mobile))
        message="Invalid Mobile";
    else if(data.password.length<6)
        message="Password Too Short";
    else if(!data.email.includes("@"))
        message="Invalid Email";
    else if(data.branch=="")
        message="Select Branch";
    else
        message="Form Submitted Successfully";

    document.getElementById("message").innerHTML=message;
});