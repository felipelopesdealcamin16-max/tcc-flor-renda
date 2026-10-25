<?php

include "conexao.php";

header("Content-Type: application/json; charset=utf-8");

$sql = "SELECT * FROM produtos";

$resultado = $conexao->query($sql);

$produtos = [];

if ($resultado) {

    while ($produto = $resultado->fetch_assoc()) {

        $produtos[] = $produto;

    }

}

echo json_encode($produtos);

$conexao->close();

?>
