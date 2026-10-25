document.getElementById("formLogin").addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (email === "" || senha === "") {
        alert("Preencha seu e-mail e sua senha.");
        return;
    }

    localStorage.setItem("usuarioLogado", "true");
    localStorage.setItem("usuarioEmail", email);

    window.location.href = "index.html";
});