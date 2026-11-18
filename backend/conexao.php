
<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$servidor = getenv("MYSQLHOST");
$porta = getenv("MYSQLPORT");
$usuario = getenv("MYSQLUSER");
$senha = getenv("MYSQLPASSWORD");
$banco = getenv("MYSQLDATABASE");

if (!$servidor || !$porta || !$usuario || !$banco) {
    http_response_code(500);
    die("Configurações do banco não encontradas.");
}

try {
    $conexao = new mysqli(
        $servidor,
        $usuario,
        $senha,
        $banco,
        (int)$porta
    );

    $conexao->set_charset("utf8mb4");

} catch (mysqli_sql_exception $e) {
    error_log("Erro MySQL: " . $e->getMessage());
    http_response_code(500);
    die("Não foi possível conectar ao banco.");
}

?>
