# Documentação simples — Flor & Renda

## 1. O que é o projeto

A Flor & Renda é uma loja virtual acadêmica de vestidos e saias.

O projeto usa:

- HTML para montar as páginas.
- CSS para cores, tamanhos, organização e responsividade.
- JavaScript para carrinho, favoritos, busca, tamanhos e formulários.
- PHP para cadastro, login, sessão e pedidos.
- MySQL para guardar os dados.
- XAMPP para executar o projeto localmente.

## 2. Arquivos principais

### `index.html`

É a página inicial da loja.

Contém o menu, lojas parceiras, categorias, novas coleções, vestidos, saias, promoções e informações da loja.

Alterações feitas:

- Logo ajustada no cabeçalho.
- Banner inicial transformado em um carrossel com três slides.
- Carrossel com troca automática, setas e indicadores.
- Produtos de vestidos e saias organizados em carrosséis horizontais com setas.
- Ordem das seções corrigida.
- Fotos das coleções corrigidas e padronizadas.
- Campo de pesquisa melhorado.
- Cards e botões alinhados.
- Favoritos mantidos no menu.
- Estrela de favorito colocada ao lado do preço.
- Seções finais redesenhadas.

### `style.css`

Controla todo o visual do projeto.

Alterações feitas:

- Layout dos cabeçalhos e menus.
- Responsividade para computador, tablet e celular.
- Alinhamento dos cards.
- Tamanho das imagens das coleções.
- Miniatura dos produtos no carrinho.
- Modal dos favoritos.
- Tela de finalizar compra.
- Estilos das promoções e seções institucionais.

Foram usados recursos simples de CSS, principalmente Flexbox, Grid, `hover`, `object-fit`, `object-position` e media queries.

### `script.js`

É o principal arquivo JavaScript do site.

Ele cuida de:

- Carrinho de compras.
- Escolha de tamanho.
- Miniatura do produto.
- Favoritos.
- Modal com a lista de favoritos.
- Busca de produtos.
- Formulário de compra.
- Contato e newsletter.
- Logout.
- Efeitos de rolagem.

Alterações feitas:

- Carrinho passou a guardar imagem e tamanho.
- Busca passou a considerar nome, marca, cor, descrição e categoria.
- A busca passou a ignorar acentos e diferenças entre letras maiúsculas e minúsculas.
- Favoritos deixaram de usar o alerta do navegador e passaram a usar um modal da página.
- Estrela de favorito foi colocada na linha do preço.
- Os carrosséis de produtos são montados com JavaScript e usam `scrollBy` para avançar um card por vez.
- Os cards antigos das lojas parceiras são convertidos para o mesmo formato visual dos cards da página inicial.
- Integração com o backend feita com `fetch`, `FormData` e JSON.

## 3. Páginas da loja

### `login.html`

Tela usada para entrar na conta. Envia e-mail e senha para `backend/login.php`.

### `cadastro.html`

Tela usada para criar uma conta. Envia os dados para `backend/cadastrar_usuario.php`.

### `carrinho.html`

Mostra os produtos adicionados, imagens, tamanhos, quantidades e total da compra.

### `finalizar.html`

Formulário final do pedido.

Alterações feitas:

- Campos organizados por assunto.
- Dados do cliente, endereço e pagamento separados.
- Layout responsivo criado com CSS Grid.
- Botão de confirmação destacado.

### `vestidos.html` e `saias.html`

Páginas específicas das duas categorias de produtos.

### `farm.html`, `zara.html`, `amaro.html`, `shoulder.html` e `levis.html`

Páginas das lojas parceiras, com os produtos de cada marca.

Os cards dessas páginas foram padronizados com a mesma estrutura da página inicial:
imagem, nome, marca, descrição, preço, estrela de favorito, botão de medidas e botão de compra.

O visual foi deixado mais compacto, com imagens menores, espaçamentos equilibrados e
a estrela de favorito posicionada no canto direito da linha do preço.
Foi adicionada uma borda salmão ao redor dos cards, que fica mais escura ao passar o mouse.

O seletor antigo foi removido. O botão `Ver medidas` abre a tabela de medidas e,
ao adicionar o produto ao carrinho, o cliente escolhe o tamanho em uma janela,
igual acontece nos produtos da página principal.

### `contato.html`

Página de contato da loja.

### `sobre.html`

Explica a história e a proposta da Flor & Renda.

### `trocas.html`

Apresenta informações de trocas e devoluções.

### `privacidade.html`

Apresenta informações sobre o uso e a proteção dos dados.

### `promocoes.html`

Apresenta promoções da loja.

### `florerenda.html`

Arquivo antigo da página inicial. A página principal usada atualmente é `index.html`.

## 4. Arquivos JavaScript antigos

### `login.js`, `cadastro.js`, `favoritos.js` e `pesquisa.js`

São arquivos antigos do projeto. As páginas atuais usam a lógica presente no próprio HTML ou no `script.js`.

Eles foram mantidos para não apagar arquivos antigos sem autorização, mas não são a parte principal da versão atual.

## 5. Pasta `backend`

### `backend/conexao.php`

Abre a conexão com o MySQL. Usa as configurações locais do XAMPP ou as variáveis do Railway.

### `backend/criar_tabelas.php`

Cria automaticamente as tabelas necessárias e cadastra os produtos iniciais.

### `backend/cadastrar_usuario.php`

Valida o cadastro, verifica se o e-mail já existe e protege a senha com `password_hash`.

### `backend/login.php`

Confere o e-mail e a senha com `password_verify` e inicia a sessão do usuário.

### `backend/logout.php`

Encerra a sessão do usuário.

### `backend/sessao.php`

Informa ao frontend se existe um usuário conectado.

### `backend/produtos.php`

Retorna os produtos cadastrados no banco em formato JSON.

### `backend/adicionar_carrinho.php`

Adiciona um item ao carrinho mantido na sessão PHP.

### `backend/listar_carrinho.php`

Retorna os itens que estão no carrinho da sessão.

### `backend/remover_carrinho.php`

Remove um produto do carrinho da sessão.

### `backend/finalizar_pedido.php`

Recebe os dados da compra, grava o pedido e grava cada item comprado no MySQL.

### `backend/contato.php`

Salva no banco as mensagens enviadas pelo formulário de contato.

### `backend/newsletter.php`

Salva no banco os e-mails cadastrados para receber novidades.

### `backend/saude.php`

Rota simples usada para verificar se o PHP conseguiu conectar ao MySQL. Também poderá ser usada pelo Railway.

## 6. Outros arquivos e pastas

### Pasta `imagens`

Guarda as fotos dos produtos, logos das marcas e a logo da Flor & Renda.

As referências das imagens foram corrigidas para usar o caminho `imagens/nome-do-arquivo`.

### `composer.json`

Informa que o projeto usa PHP 8.2 e a extensão `mysqli`.

### `railway.json`

Deixa o projeto preparado para um futuro deploy no Railway.

O deploy ainda não foi realizado.

### `README.md`

Contém instruções rápidas para executar o projeto no XAMPP e, futuramente, no Railway.

### `AGENTS.md`

Contém as regras combinadas para alterar o projeto: código simples, fácil de entender, bem explicado e testado.

### `banner.jpg`

Imagem antiga de banner mantida no projeto.

## 7. Banco de dados

O banco usado localmente se chama `flor_renda`.

As principais tabelas são:

- `usuarios`: contas cadastradas.
- `produtos`: produtos da loja.
- `pedidos`: informações gerais das compras.
- `pedido_itens`: produtos de cada pedido.
- `contatos`: mensagens recebidas.
- `newsletter`: e-mails cadastrados.

## 8. Como executar

1. Abrir o XAMPP.
2. Iniciar Apache e MySQL.
3. Abrir `http://localhost/Flor---Renda`.
4. Criar uma conta ou entrar com uma conta existente.

## 9. Observação final

O código foi mantido propositalmente simples, usando funções diretas, nomes claros e poucos níveis de abstração, para continuar compatível com um projeto de pessoas iniciantes em programação.
