<?php

session_start();

$produto_id = $_POST["produto_id"] ?? "";

$produto_id = intval($produto_id);

if ($produto_id <= 0) {
    echo "Produto inválido.";
    exit;
}

/* Verifica se existe carrinho */
if (!isset($_SESSION["carrinho"])) {
    echo "Carrinho vazio.";
    exit;
}

/* Verifica se o produto está no carrinho */
if (!isset($_SESSION["carrinho"][$produto_id])) {
    echo "Produto não está no carrinho.";
    exit;
}

/* Remove o produto */
unset($_SESSION["carrinho"][$produto_id]);

echo "Produto removido do carrinho.";

?>