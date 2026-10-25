<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

if (
    !isset($_SESSION["usuario_id"]) ||
    ($_SESSION["usuario_tipo"] ?? "") !== "empresa"
) {
    http_response_code(401);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Acesso permitido apenas para empresas parceiras."
    ]);
    exit;
}

include "conexao.php";

$usuarioId = intval($_SESSION["usuario_id"]);

$sql = "SELECT nome_fantasia, razao_social, cnpj, telefone, site, logo, status
        FROM empresas_parceiras
        WHERE usuario_id = ?
        LIMIT 1";

$stmt = $conexao->prepare($sql);
$stmt->bind_param("i", $usuarioId);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    http_response_code(404);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Cadastro da empresa não encontrado."
    ]);
} else {
    echo json_encode([
        "sucesso" => true,
        "empresa" => $resultado->fetch_assoc()
    ]);
}

$stmt->close();
$conexao->close();

?>
