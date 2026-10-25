<?php

include "conexao.php";

$nome = $_POST["nome"] ?? "";
$email = $_POST["email"] ?? "";
$senha = $_POST["senha"] ?? "";

$nome = trim($nome);
$email = trim($email);
$senha = trim($senha);

if ($nome == "" || $email == "" || $senha == "") {
    echo "Preencha todos os campos.";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Digite um e-mail válido.";
    exit;
}

if (strlen($senha) < 6) {
    echo "A senha precisa ter pelo menos 6 caracteres.";
    exit;
}

/* Verifica se o e-mail já existe */
$sql = "SELECT id FROM usuarios WHERE email = ?";

$stmt = $conexao->prepare($sql);

if (!$stmt) {
    echo "Erro no banco: " . $conexao->error;
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    echo "Este e-mail já está cadastrado.";
    $stmt->close();
    $conexao->close();
    exit;
}

$stmt->close();

/* Cadastra o usuário */
$tipo = "cliente";

$sql = "INSERT INTO usuarios (nome, email, senha, tipo)
        VALUES (?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

if (!$stmt) {
    echo "Erro no banco: " . $conexao->error;
    exit;
}

$senhaProtegida = password_hash($senha, PASSWORD_DEFAULT);

$stmt->bind_param("ssss", $nome, $email, $senhaProtegida, $tipo);

if ($stmt->execute()) {
    echo "sucesso";
} else {
    echo "Erro no cadastro: " . $stmt->error;
}

$stmt->close();
$conexao->close();

?>
