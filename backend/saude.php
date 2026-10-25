<?php

header("Content-Type: application/json; charset=utf-8");

include "conexao.php";

$resultado = $conexao->query("SELECT 1");

if (!$resultado) {
    http_response_code(500);
    echo json_encode(["status" => "erro"]);
    exit;
}

echo json_encode([
    "status" => "ok",
    "banco" => "conectado"
]);

$conexao->close();

?>

