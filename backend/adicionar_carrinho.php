<?php

session_start();

include "conexao.php";

$produto_id = $_POST["produto_id"] ?? "";
$quantidade = $_POST["quantidade"] ?? 1;

$produto_id = intval($produto_id);
$quantidade = intval($quantidade);

if ($produto_id <= 0) {
    echo "Produto inválido.";
    exit;
}

if ($quantidade <= 0) {
    $quantidade = 1;
}

/* Busca o produto no banco */
$sql = "SELECT id, nome, preco, estoque
        FROM produtos
        WHERE id = ?
        LIMIT 1";

$stmt = $conexao->prepare($sql);

if (!$stmt) {
    echo "Erro no banco: " . $conexao->error;
    exit;
}

$stmt->bind_param("i", $produto_id);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows == 0) {
    echo "Produto não encontrado.";
    $stmt->close();
    $conexao->close();
    exit;
}

$produto = $resultado->fetch_assoc();

$stmt->close();

/* Verifica o estoque */
if ($produto["estoque"] < $quantidade) {
    echo "Quantidade indisponível em estoque.";
    $conexao->close();
    exit;
}

/* Cria o carrinho na sessão */
if (!isset($_SESSION["carrinho"])) {
    $_SESSION["carrinho"] = [];
}

/* Se o produto já estiver no carrinho */
if (isset($_SESSION["carrinho"][$produto_id])) {

    $novaQuantidade =
        $_SESSION["carrinho"][$produto_id]["quantidade"] + $quantidade;

    if ($novaQuantidade > $produto["estoque"]) {
        echo "Quantidade maior que o estoque disponível.";
        $conexao->close();
        exit;
    }

    $_SESSION["carrinho"][$produto_id]["quantidade"] = $novaQuantidade;

} else {

    $_SESSION["carrinho"][$produto_id] = [
        "id" => $produto["id"],
        "nome" => $produto["nome"],
        "preco" => $produto["preco"],
        "quantidade" => $quantidade
    ];
}

echo "Produto adicionado ao carrinho.";

$conexao->close();

?>