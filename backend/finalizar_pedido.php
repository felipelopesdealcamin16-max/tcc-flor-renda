<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

function responder($sucesso, $mensagem, $pedidoId = null) {
    echo json_encode([
        "sucesso" => $sucesso,
        "mensagem" => $mensagem,
        "pedido_id" => $pedidoId
    ]);
    exit;
}

if (!isset($_SESSION["usuario_id"])) {
    http_response_code(401);
    responder(false, "Faça login antes de finalizar a compra.");
}

include "conexao.php";

$camposObrigatorios = [
    "nome", "email", "telefone", "cpf", "cep", "rua",
    "numero", "bairro", "cidade", "estado", "pagamento"
];

foreach ($camposObrigatorios as $campo) {
    if (trim($_POST[$campo] ?? "") == "") {
        responder(false, "Preencha todos os campos obrigatórios.");
    }
}

$itens = json_decode($_POST["carrinho"] ?? "[]", true);

if (!is_array($itens) || count($itens) == 0) {
    responder(false, "O carrinho está vazio.");
}

$total = 0;

foreach ($itens as $item) {
    $preco = floatval($item["preco"] ?? 0);
    $quantidade = intval($item["quantidade"] ?? 0);

    if ($preco <= 0 || $quantidade <= 0 || trim($item["nome"] ?? "") == "") {
        responder(false, "Existe um produto inválido no carrinho.");
    }

    $total += $preco * $quantidade;
}

$usuarioId = $_SESSION["usuario_id"];
$nome = trim($_POST["nome"]);
$email = trim($_POST["email"]);
$telefone = trim($_POST["telefone"]);
$cpf = trim($_POST["cpf"]);
$cep = trim($_POST["cep"]);
$rua = trim($_POST["rua"]);
$numero = trim($_POST["numero"]);
$complemento = trim($_POST["complemento"] ?? "");
$bairro = trim($_POST["bairro"]);
$cidade = trim($_POST["cidade"]);
$estado = trim($_POST["estado"]);
$pagamento = trim($_POST["pagamento"]);

$conexao->begin_transaction();

try {
    $sqlPedido = "INSERT INTO pedidos (
        usuario_id, nome_cliente, email, telefone, cpf, cep, rua,
        numero, complemento, bairro, cidade, estado, pagamento, total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmtPedido = $conexao->prepare($sqlPedido);
    $stmtPedido->bind_param(
        "issssssssssssd",
        $usuarioId,
        $nome,
        $email,
        $telefone,
        $cpf,
        $cep,
        $rua,
        $numero,
        $complemento,
        $bairro,
        $cidade,
        $estado,
        $pagamento,
        $total
    );
    $stmtPedido->execute();

    $pedidoId = $conexao->insert_id;
    $stmtPedido->close();

    $sqlItem = "INSERT INTO pedido_itens
                (pedido_id, nome_produto, tamanho, preco, quantidade)
                VALUES (?, ?, ?, ?, ?)";
    $stmtItem = $conexao->prepare($sqlItem);

    foreach ($itens as $item) {
        $nomeProduto = trim($item["nome"]);
        $tamanho = trim($item["tamanho"] ?? "Não informado");
        $preco = floatval($item["preco"]);
        $quantidade = intval($item["quantidade"]);

        $stmtItem->bind_param(
            "issdi",
            $pedidoId,
            $nomeProduto,
            $tamanho,
            $preco,
            $quantidade
        );
        $stmtItem->execute();
    }

    $stmtItem->close();
    $conexao->commit();
    $conexao->close();

    responder(true, "Pedido realizado com sucesso!", $pedidoId);
} catch (Throwable $erro) {
    $conexao->rollback();
    $conexao->close();

    http_response_code(500);
    responder(false, "Não foi possível salvar o pedido.");
}

?>
