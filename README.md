# Flor & Renda

Loja virtual acadêmica feita com HTML, CSS, JavaScript, PHP e MySQL.

## Como o projeto funciona

- O frontend está nos arquivos HTML, no `style.css` e no `script.js`.
- O backend está na pasta `backend` e usa PHP puro com `mysqli`.
- O carrinho fica no `localStorage` do navegador enquanto a compra não é finalizada.
- Cadastro, login, sessão e pedidos são gravados no MySQL.
- As tabelas são criadas automaticamente na primeira conexão com o banco.

## Executar no XAMPP

1. Inicie o Apache e o MySQL no painel do XAMPP.
2. Crie um banco chamado `flor_renda` no phpMyAdmin.
3. Coloque o projeto dentro da pasta `htdocs` do XAMPP.
4. Abra `http://localhost/Flor---Renda`.

As tabelas são criadas automaticamente na primeira página que usa o backend.

## Deploy no Railway

1. Crie um projeto no Railway.
2. Adicione um serviço MySQL.
3. Adicione este repositório como um serviço.
4. No serviço da aplicação, crie referências para as variáveis do MySQL:
   - `MYSQLHOST=${{MySQL.MYSQLHOST}}`
   - `MYSQLPORT=${{MySQL.MYSQLPORT}}`
   - `MYSQLUSER=${{MySQL.MYSQLUSER}}`
   - `MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}`
   - `MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}`
5. Aplique as alterações e gere um domínio público em **Settings > Networking**.

O Railway usa PHP diretamente pelo Railpack. A rota `/backend/saude.php` confirma se a aplicação conseguiu conectar ao MySQL.

## Observação sobre pagamentos

O projeto registra a forma de pagamento escolhida, mas não cobra valores reais nem guarda dados de cartão. Uma loja real deve usar um Checkout pronto.
