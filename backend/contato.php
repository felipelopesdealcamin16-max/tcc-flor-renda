<?php

header("Content-Type: application/json; charset=utf-8");

include "conexao.php";

$nome = trim($_POST["nome"] ?? "");
$email = trim($_POST["email"] ?? "");
$mensagem = trim($_POST["mensagem"] ?? "");

if ($nome == "" || $email == "" || $mensagem == "") {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Preencha todos os campos."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Digite um e-mail válido."
    ]);
    exit;
}

$sql = "INSERT INTO contatos (nome, email, mensagem) VALUES (?, ?, ?)";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("sss", $nome, $email, $mensagem);

if ($stmt->execute()) {
    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Mensagem enviada com sucesso!"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Não foi possível enviar a mensagem."
    ]);
}

$stmt->close();
$conexao->close();

?>
