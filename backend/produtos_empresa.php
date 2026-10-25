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
$sqlEmpresa = "SELECT id, status FROM empresas_parceiras
               WHERE usuario_id = ? LIMIT 1";
$stmtEmpresa = $conexao->prepare($sqlEmpresa);
$stmtEmpresa->bind_param("i", $usuarioId);
$stmtEmpresa->execute();
$empresa = $stmtEmpresa->get_result()->fetch_assoc();
$stmtEmpresa->close();

if (!$empresa || $empresa["status"] !== "aprovada") {
    http_response_code(403);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "O catálogo é liberado somente após a aprovação."
    ]);
    exit;
}

$empresaId = intval($empresa["id"]);
$stmt = $conexao->prepare(
    "SELECT id, nome, marca, preco, estoque, imagem
     FROM produtos WHERE empresa_id = ? ORDER BY id DESC"
);
$stmt->bind_param("i", $empresaId);
$stmt->execute();

echo json_encode([
    "sucesso" => true,
    "produtos" => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)
]);

$stmt->close();
$conexao->close();

?>
