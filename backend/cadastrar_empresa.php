<?php

include "conexao.php";

$nomeFantasia = trim($_POST["nome_fantasia"] ?? "");
$razaoSocial = trim($_POST["razao_social"] ?? "");
$cnpj = preg_replace("/\D/", "", $_POST["cnpj"] ?? "");
$telefone = trim($_POST["telefone"] ?? "");
$site = trim($_POST["site"] ?? "");
$logo = trim($_POST["logo"] ?? "");
$email = trim($_POST["email"] ?? "");
$senha = trim($_POST["senha"] ?? "");

if (
    $nomeFantasia === "" ||
    $razaoSocial === "" ||
    $cnpj === "" ||
    $telefone === "" ||
    $email === "" ||
    $senha === ""
) {
    echo "Preencha todos os campos obrigatórios.";
    exit;
}

if (strlen($cnpj) !== 14) {
    echo "Digite um CNPJ com 14 números.";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Digite um e-mail válido.";
    exit;
}

if ($site !== "" && !filter_var($site, FILTER_VALIDATE_URL)) {
    echo "Digite um endereço de site válido, incluindo http:// ou https://.";
    exit;
}

if ($logo !== "" && !filter_var($logo, FILTER_VALIDATE_URL)) {
    echo "Digite uma URL válida para a logo, incluindo http:// ou https://.";
    exit;
}

if (strlen($senha) < 6) {
    echo "A senha precisa ter pelo menos 6 caracteres.";
    exit;
}

$sql = "SELECT id FROM usuarios WHERE email = ?";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

if ($stmt->get_result()->num_rows > 0) {
    echo "Este e-mail já está cadastrado.";
    $stmt->close();
    $conexao->close();
    exit;
}

$stmt->close();

$sql = "SELECT id FROM empresas_parceiras WHERE cnpj = ?";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("s", $cnpj);
$stmt->execute();

if ($stmt->get_result()->num_rows > 0) {
    echo "Este CNPJ já está cadastrado.";
    $stmt->close();
    $conexao->close();
    exit;
}

$stmt->close();
$conexao->begin_transaction();

try {
    $tipo = "empresa";
    $senhaProtegida = password_hash($senha, PASSWORD_DEFAULT);

    $sqlUsuario = "INSERT INTO usuarios (nome, email, senha, tipo)
                   VALUES (?, ?, ?, ?)";
    $stmtUsuario = $conexao->prepare($sqlUsuario);
    $stmtUsuario->bind_param(
        "ssss",
        $nomeFantasia,
        $email,
        $senhaProtegida,
        $tipo
    );
    $stmtUsuario->execute();

    $usuarioId = $conexao->insert_id;
    $stmtUsuario->close();

    $sqlEmpresa = "INSERT INTO empresas_parceiras
                   (usuario_id, nome_fantasia, razao_social, cnpj, telefone, site, logo)
                   VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmtEmpresa = $conexao->prepare($sqlEmpresa);
    $stmtEmpresa->bind_param(
        "issssss",
        $usuarioId,
        $nomeFantasia,
        $razaoSocial,
        $cnpj,
        $telefone,
        $site,
        $logo
    );
    $stmtEmpresa->execute();
    $stmtEmpresa->close();

    $conexao->commit();
    echo "sucesso";
} catch (Throwable $erro) {
    $conexao->rollback();
    echo "Não foi possível cadastrar a empresa.";
}

$conexao->close();

?>
