//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e) {
    document.getElementById("submitBtn").addEventListener("click", function(e) {
        let inputEmail = document.getElementById("inputEmail");
        let inputPassword = document.getElementById("inputPassword");
        let fieldFilled = true;

        if (inputEmail.value === "" || inputPassword.value === "") {
            fieldFilled = false;
        }

        if (fieldFilled) {
            localStorage.setItem('userLogged', JSON.stringify({ email: inputEmail.value }));
            window.location = "main-page.html";
        } else {
            alert("Debes ingresar los datos en ambos campos.")
        }
    });
});