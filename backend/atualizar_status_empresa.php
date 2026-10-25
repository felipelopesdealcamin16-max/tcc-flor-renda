<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

if (
    !isset($_SESSION["usuario_id"]) ||
    ($_SESSION["usuario_tipo"] ?? "") !== "admin"
) {
    http_response_code(401);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Acesso permitido apenas para administradores."
    ]);
    exit;
}

$empresaId = filter_input(INPUT_POST, "empresa_id", FILTER_VALIDATE_INT);
$status = trim($_POST["status"] ?? "");
$statusPermitidos = ["aprovada", "reprovada"];

if (!$empresaId || !in_array($status, $statusPermitidos, true)) {
    http_response_code(400);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Empresa ou status inválido."
    ]);
    exit;
}

include "conexao.php";

$sql = "UPDATE empresas_parceiras SET status = ? WHERE id = ?";
$stmt = $conexao->prepare($sql);
$stmt->bind_param("si", $status, $empresaId);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    $verificar = $conexao->prepare(
        "SELECT id FROM empresas_parceiras WHERE id = ? LIMIT 1"
    );
    $verificar->bind_param("i", $empresaId);
    $verificar->execute();

    if ($verificar->get_result()->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Empresa não encontrada."
        ]);
        $verificar->close();
        $stmt->close();
        $conexao->close();
        exit;
    }

    $verificar->close();
}

echo json_encode([
    "sucesso" => true,
    "mensagem" => "Status atualizado para " . $status . "."
]);

$stmt->close();
$conexao->close();

?>
