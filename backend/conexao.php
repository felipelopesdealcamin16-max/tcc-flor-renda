<?php

$servidor = getenv("MYSQLHOST") ?: "localhost";
$porta = getenv("MYSQLPORT") ?: "3306";
$usuario = getenv("MYSQLUSER") ?: "root";
$senha = getenv("MYSQLPASSWORD") ?: "";
$banco = getenv("MYSQLDATABASE") ?: "flor_renda";

$conexao = new mysqli(
    $servidor,
    $usuario,
    $senha,
    $banco,
    intval($porta)
);

if ($conexao->connect_error) {
    http_response_code(500);
    die("Não foi possível conectar ao banco de dados.");
}

$conexao->set_charset("utf8mb4");

include_once __DIR__ . "/criar_tabelas.php";

?>
