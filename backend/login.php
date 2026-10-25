<?php

session_start();

include "conexao.php";

$email = $_POST["email"] ?? "";
$senha = $_POST["senha"] ?? "";

$email = trim($email);
$senha = trim($senha);

if ($email == "" || $senha == "") {
    echo "Preencha o e-mail e a senha.";
    exit;
}

$sql = "SELECT id, nome, email, senha, tipo
        FROM usuarios
        WHERE email = ?
        LIMIT 1";

$stmt = $conexao->prepare($sql);

if (!$stmt) {
    echo "Erro no banco: " . $conexao->error;
    exit;
}

$stmt->bind_param("s", $email);

if (!$stmt->execute()) {
    echo "Erro ao executar login: " . $stmt->error;
    exit;
}

$resultado = $stmt->get_result();

if ($resultado->num_rows == 0) {
    echo "E-mail ou senha incorretos.";
    $stmt->close();
    $conexao->close();
    exit;
}

$usuario = $resultado->fetch_assoc();

/*
password_verify compara a senha digitada com a senha protegida do banco.
*/
$senhaProtegida = password_verify($senha, $usuario["senha"]);
$senhaAntiga = hash_equals($usuario["senha"], $senha);

if (!$senhaProtegida && !$senhaAntiga) {
    echo "E-mail ou senha incorretos.";
    $stmt->close();
    $conexao->close();
    exit;
}

/* Se era uma senha antiga, ela é protegida depois do primeiro login. */
if ($senhaAntiga) {
    $novoHash = password_hash($senha, PASSWORD_DEFAULT);
    $sqlAtualizarSenha = "UPDATE usuarios SET senha = ? WHERE id = ?";
    $stmtSenha = $conexao->prepare($sqlAtualizarSenha);
    $stmtSenha->bind_param("si", $novoHash, $usuario["id"]);
    $stmtSenha->execute();
    $stmtSenha->close();
}

session_regenerate_id(true);

$_SESSION["usuario_id"] = $usuario["id"];
$_SESSION["usuario_nome"] = $usuario["nome"];
$_SESSION["usuario_email"] = $usuario["email"];
$_SESSION["usuario_tipo"] = $usuario["tipo"];

echo "sucesso|" . $usuario["tipo"];

$stmt->close();
$conexao->close();

?>
