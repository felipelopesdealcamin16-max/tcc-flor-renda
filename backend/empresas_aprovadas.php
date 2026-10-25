<?php

include "conexao.php";

header("Content-Type: application/json; charset=utf-8");

$sql = "SELECT id, nome_fantasia, logo
        FROM empresas_parceiras
        WHERE status = 'aprovada'
        ORDER BY nome_fantasia";
$resultado = $conexao->query($sql);

echo json_encode(
    $resultado ? $resultado->fetch_all(MYSQLI_ASSOC) : []
);

$conexao->close();

?>
