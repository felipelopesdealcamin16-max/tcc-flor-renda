<?php

include "conexao.php";

header("Content-Type: application/json; charset=utf-8");

$sql = "SELECT p.id, p.nome, p.marca, p.preco, p.estoque, p.imagem
        FROM produtos p
        INNER JOIN empresas_parceiras e ON e.id = p.empresa_id
        WHERE e.status = 'aprovada' AND p.estoque > 0
        ORDER BY p.id DESC";
$resultado = $conexao->query($sql);

echo json_encode(
    $resultado ? $resultado->fetch_all(MYSQLI_ASSOC) : []
);

$conexao->close();

?>
