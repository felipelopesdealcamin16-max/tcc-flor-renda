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

include "conexao.php";

$sql = "SELECT e.id, e.nome_fantasia, e.razao_social, e.cnpj,
               e.telefone, e.site, e.logo, e.status, e.criado_em, u.email
        FROM empresas_parceiras e
        INNER JOIN usuarios u ON u.id = e.usuario_id
        ORDER BY FIELD(e.status, 'pendente', 'aprovada', 'reprovada'),
                 e.criado_em DESC";

$resultado = $conexao->query($sql);

if (!$resultado) {
    http_response_code(500);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Não foi possível carregar as empresas."
    ]);
    exit;
}

echo json_encode([
    "sucesso" => true,
    "empresas" => $resultado->fetch_all(MYSQLI_ASSOC)
]);

$conexao->close();

?>
