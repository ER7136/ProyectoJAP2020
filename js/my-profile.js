document.addEventListener("DOMContentLoaded", function(e) {
    let profile = localStorage.getItem("profile");

    if (profile) {
        profile = JSON.parse(profile);

        if (profile.imgUrl != "") {
            document.getElementById("profileImg").src = profile.imgUrl;
        }
        document.getElementById("imgUrl").value = profile.imgUrl;
        document.getElementById("names").value = profile.names;
        document.getElementById("surnames").value = profile.surnames;
        document.getElementById("age").value = profile.age;
        document.getElementById("email").value = profile.email;
        document.getElementById("phone").value = profile.phone;
    }

    document.getElementById("saveChanges").addEventListener("click", function(e) {
        let imgUrl = document.getElementById("imgUrl");
        let names = document.getElementById("names");
        let surnames = document.getElementById("surnames");
        let age = document.getElementById("age");
        let email = document.getElementById("email");
        let phone = document.getElementById("phone");
        let validated = true;

        if (names.value === "") {
            names.classList.add("is-invalid");
            validated = false;
        } else {
            names.classList.remove("is-invalid");
        }

        if (surnames.value === "") {
            surnames.classList.add("is-invalid");
            validated = false;
        } else {
            surnames.classList.remove("is-invalid");
        }

        if (age.value === "") {
            age.classList.add("is-invalid");
            validated = false;
        } else {
            age.classList.remove("is-invalid");
        }

        if (email.value === "") {
            email.classList.add("is-invalid");
            validated = false;
        } else {
            email.classList.remove("is-invalid");
        }

        if (phone.value === "") {
            phone.classList.add("is-invalid");
            validated = false;
        } else {
            phone.classList.remove("is-invalid");
        }

        if (validated) {
            localStorage.setItem("profile", JSON.stringify({
                imgUrl: imgUrl.value,
                names: names.value,
                surnames: surnames.value,
                age: age.value,
                email: email.value,
                phone: phone.value
            }));
            window.location = "my-profile.html";
        }
    });
});