<?php

/*
Este arquivo cria as tabelas necessárias quando elas ainda não existem.
Isso facilita a primeira execução local e o deploy no Railway.
*/

$sqlUsuarios = "CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'cliente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

$sqlEmpresas = "CREATE TABLE IF NOT EXISTS empresas_parceiras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    nome_fantasia VARCHAR(120) NOT NULL,
    razao_social VARCHAR(160) NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(30) NOT NULL,
    site VARCHAR(255),
    logo VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
)";

$sqlProdutos = "CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NULL,
    nome VARCHAR(150) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 10,
    imagem VARCHAR(255),
    FOREIGN KEY (empresa_id) REFERENCES empresas_parceiras(id) ON DELETE CASCADE
)";

$sqlPedidos = "CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome_cliente VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(30) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    cep VARCHAR(15) NOT NULL,
    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    pagamento VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'recebido',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
)";

$sqlItens = "CREATE TABLE IF NOT EXISTS pedido_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    nome_produto VARCHAR(150) NOT NULL,
    tamanho VARCHAR(10),
    preco DECIMAL(10, 2) NOT NULL,
    quantidade INT NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
)";

$sqlContatos = "CREATE TABLE IF NOT EXISTS contatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mensagem TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

$sqlNewsletter = "CREATE TABLE IF NOT EXISTS newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!$conexao->query($sqlUsuarios)) {
    die("Erro ao criar a tabela de usuários: " . $conexao->error);
}

/* Conta inicial para instalações locais e deploys. Não altera contas existentes. */
$emailAdminInicial = "admin@doceflor.com";
$consultaAdminInicial = $conexao->prepare("SELECT id FROM usuarios WHERE email = ? LIMIT 1");
$consultaAdminInicial->bind_param("s", $emailAdminInicial);
$consultaAdminInicial->execute();
$adminInicialExiste = $consultaAdminInicial->get_result()->num_rows > 0;
$consultaAdminInicial->close();

if (!$adminInicialExiste) {
    $hashAdminInicial = password_hash("admin", PASSWORD_DEFAULT);
    // A chave única do e-mail também protege contra inicializações simultâneas.
    $inserirAdminInicial = $conexao->prepare(
        "INSERT INTO usuarios (nome, email, senha, tipo)
         VALUES ('Administrador', ?, ?, 'admin')
         ON DUPLICATE KEY UPDATE id = id"
    );
    $inserirAdminInicial->bind_param("ss", $emailAdminInicial, $hashAdminInicial);
    $inserirAdminInicial->execute();
    $inserirAdminInicial->close();
}

if (!$conexao->query($sqlEmpresas)) {
    die("Erro ao criar a tabela de empresas parceiras: " . $conexao->error);
}

/* Adiciona a logo em bancos criados antes desta funcionalidade. */
$colunaLogo = $conexao->query(
    "SHOW COLUMNS FROM empresas_parceiras LIKE 'logo'"
);

if ($colunaLogo && $colunaLogo->num_rows === 0) {
    if (!$conexao->query(
        "ALTER TABLE empresas_parceiras ADD COLUMN logo VARCHAR(255) NULL AFTER site"
    )) {
        die("Erro ao atualizar as empresas parceiras: " . $conexao->error);
    }
}

if (!$conexao->query($sqlProdutos)) {
    die("Erro ao criar a tabela de produtos: " . $conexao->error);
}

/* Atualiza bancos já existentes com o vínculo entre produto e empresa. */
$colunaEmpresa = $conexao->query(
    "SHOW COLUMNS FROM produtos LIKE 'empresa_id'"
);

if ($colunaEmpresa && $colunaEmpresa->num_rows === 0) {
    $sqlVinculoEmpresa = "ALTER TABLE produtos
        ADD COLUMN empresa_id INT NULL AFTER id,
        ADD INDEX idx_produtos_empresa (empresa_id),
        ADD CONSTRAINT fk_produtos_empresa
            FOREIGN KEY (empresa_id) REFERENCES empresas_parceiras(id)
            ON DELETE CASCADE";

    if (!$conexao->query($sqlVinculoEmpresa)) {
        die("Erro ao atualizar a tabela de produtos: " . $conexao->error);
    }
}

if (!$conexao->query($sqlPedidos)) {
    die("Erro ao criar a tabela de pedidos: " . $conexao->error);
}

if (!$conexao->query($sqlItens)) {
    die("Erro ao criar a tabela de itens: " . $conexao->error);
}

if (!$conexao->query($sqlContatos)) {
    die("Erro ao criar a tabela de contatos: " . $conexao->error);
}

if (!$conexao->query($sqlNewsletter)) {
    die("Erro ao criar a tabela da newsletter: " . $conexao->error);
}

/* Insere alguns produtos apenas quando a tabela ainda está vazia. */
$resultadoProdutos = $conexao->query("SELECT COUNT(*) AS quantidade FROM produtos");
$quantidadeProdutos = $resultadoProdutos->fetch_assoc()["quantidade"];

if ($quantidadeProdutos == 0) {
    $produtos = [
        ["Vestido Curto Floral FARM", "FARM", 159.90, "imagens/vestidocurto1.jpg"],
        ["Vestido Longo Floral FARM", "FARM", 189.90, "imagens/vestidolongofarm.webp"],
        ["Vestido Longo Azul ZARA", "ZARA", 259.90, "imagens/amarelo flor.webp"],
        ["Vestido Longo Elegante AMARO", "AMARO", 239.90, "imagens/branco flor.webp"],
        ["Vestido Longo Tropical SHOULDER", "SHOULDER", 249.90, "imagens/vestido verde.webp"],
        ["Vestido Floral Azul FARM", "FARM", 269.90, "imagens/vestido flor.webp"],
        ["Saia Floral Rosa ZARA", "ZARA", 129.90, "imagens/saia.jpg"],
        ["Saia Floral Clara FARM", "FARM", 139.90, "imagens/saia.1.webp"],
        ["Saia Azul AMARO", "AMARO", 149.90, "imagens/saia azul.jpeg"],
        ["Saia Preta SHOULDER", "SHOULDER", 159.90, "imagens/saia preta.webp"]
    ];

    $sqlProduto = "INSERT INTO produtos (nome, marca, preco, imagem)
                   VALUES (?, ?, ?, ?)";
    $stmtProduto = $conexao->prepare($sqlProduto);

    foreach ($produtos as $produto) {
        $stmtProduto->bind_param(
            "ssds",
            $produto[0],
            $produto[1],
            $produto[2],
            $produto[3]
        );
        $stmtProduto->execute();
    }

    $stmtProduto->close();
}

?>
