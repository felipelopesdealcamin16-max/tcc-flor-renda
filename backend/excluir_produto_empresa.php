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

$produtoId = filter_input(INPUT_POST, "produto_id", FILTER_VALIDATE_INT);

if (!$produtoId) {
    http_response_code(400);
    echo json_encode(["sucesso" => false, "mensagem" => "Produto inválido."]);
    exit;
}

include "conexao.php";

$usuarioId = intval($_SESSION["usuario_id"]);
$stmt = $conexao->prepare(
    "DELETE p FROM produtos p
     INNER JOIN empresas_parceiras e ON e.id = p.empresa_id
     WHERE p.id = ? AND e.usuario_id = ?"
);
$stmt->bind_param("ii", $produtoId, $usuarioId);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    http_response_code(404);
    echo json_encode(["sucesso" => false, "mensagem" => "Produto não encontrado."]);
} else {
    echo json_encode(["sucesso" => true, "mensagem" => "Produto removido."]);
}

$stmt->close();
$conexao->close();

?>
