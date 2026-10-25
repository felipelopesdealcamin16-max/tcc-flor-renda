<?php

header("Content-Type: application/json; charset=utf-8");

include "conexao.php";

$email = trim($_POST["email"] ?? "");

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Digite um e-mail válido."
    ]);
    exit;
}

$sql = "INSERT IGNORE INTO newsletter (email) VALUES (?)";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

if ($stmt->affected_rows == 0) {
    $mensagem = "Este e-mail já está cadastrado.";
} else {
    $mensagem = "E-mail cadastrado com sucesso!";
}

echo json_encode([
    "sucesso" => true,
    "mensagem" => $mensagem
]);

$stmt->close();
$conexao->close();

?>
