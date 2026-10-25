document.getElementById("formCadastro").addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("senhaCadastro").value;

    if (nome === "" || email === "" || senha === "") {
        alert("Preencha todos os campos.");
        return;
    }

    localStorage.setItem("nomeUsuario", nome);
    localStorage.setItem("emailUsuario", email);
    localStorage.setItem("senhaUsuario", senha);

    alert("Conta criada com sucesso!");

    window.location.href = "login.html";

});