<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

$carrinho = $_SESSION["carrinho"] ?? [];

echo json_encode(array_values($carrinho));

?>
