<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

if (
    !isset($_SESSION["usuario_id"]) ||
    ($_SESSION["usuario_tipo"] ?? "") !== "empresa"
) {
    http_response_code(401);
    echo json_encode(["sucesso" => false, "mensagem" => "Acesso não autorizado."]);
    exit;
}

include "conexao.php";

$usuarioId = intval($_SESSION["usuario_id"]);
$nome = trim($_POST["nome"] ?? "");
$precoTexto = str_replace(",", ".", trim($_POST["preco"] ?? ""));
$estoqueTexto = trim($_POST["estoque"] ?? "");
$imagem = trim($_POST["imagem"] ?? "");

if ($nome === "" || mb_strlen($nome) > 150) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Informe um nome válido."]);
    exit;
}

if (!is_numeric($precoTexto) || floatval($precoTexto) <= 0) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Informe um preço válido."]);
    exit;
}

if (filter_var($estoqueTexto, FILTER_VALIDATE_INT) === false || intval($estoqueTexto) < 0) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Informe um estoque válido."]);
    exit;
}

if (
    $imagem !== "" &&
    !filter_var($imagem, FILTER_VALIDATE_URL) &&
    !preg_match('#^imagens/[a-zA-Z0-9._ /-]+$#', $imagem)
) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Informe uma URL de imagem válida."]);
    exit;
}

$stmtEmpresa = $conexao->prepare(
    "SELECT id, nome_fantasia, status FROM empresas_parceiras
     WHERE usuario_id = ? LIMIT 1"
);
$stmtEmpresa->bind_param("i", $usuarioId);
$stmtEmpresa->execute();
$empresa = $stmtEmpresa->get_result()->fetch_assoc();
$stmtEmpresa->close();

if (!$empresa || $empresa["status"] !== "aprovada") {
    http_response_code(403);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Sua empresa precisa estar aprovada para cadastrar produtos."
    ]);
    exit;
}

$empresaId = intval($empresa["id"]);
$marca = $empresa["nome_fantasia"];
$preco = floatval($precoTexto);
$estoque = intval($estoqueTexto);
$imagem = $imagem !== "" ? $imagem : "imagens/logo.jpeg";

$stmt = $conexao->prepare(
    "INSERT INTO produtos (empresa_id, nome, marca, preco, estoque, imagem)
     VALUES (?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("issdis", $empresaId, $nome, $marca, $preco, $estoque, $imagem);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["sucesso" => false, "mensagem" => "Não foi possível cadastrar o produto."]);
} else {
    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Produto cadastrado e publicado na loja."
    ]);
}

$stmt->close();
$conexao->close();

?>
