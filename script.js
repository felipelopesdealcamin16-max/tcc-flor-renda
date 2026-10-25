// =====================================
// CARRINHO DE COMPRAS
// =====================================

let carrinho =
    JSON.parse(localStorage.getItem("carrinho")) || [];


// =====================================
// MENU RESPONSIVO
// =====================================

function criarMenuResponsivo() {

    const cabecalho = document.querySelector("header");
    const menu = cabecalho ? cabecalho.querySelector("nav") : null;

    if (!cabecalho || !menu) {
        return;
    }

    const botaoMenu = document.createElement("button");

    botaoMenu.type = "button";
    botaoMenu.className = "botao-menu";
    botaoMenu.textContent = "☰ Menu";
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");

    cabecalho.insertBefore(botaoMenu, menu);
    document.body.classList.add("tem-menu-responsivo");

    botaoMenu.addEventListener("click", function() {

        const menuEstaAberto =
            cabecalho.classList.toggle("menu-aberto");

        botaoMenu.textContent = menuEstaAberto
            ? "× Fechar"
            : "☰ Menu";

        botaoMenu.setAttribute(
            "aria-expanded",
            String(menuEstaAberto)
        );

        botaoMenu.setAttribute(
            "aria-label",
            menuEstaAberto ? "Fechar menu" : "Abrir menu"
        );

    });

    menu.querySelectorAll("a").forEach(function(link) {

        link.addEventListener("click", function() {

            cabecalho.classList.remove("menu-aberto");
            botaoMenu.textContent = "☰ Menu";
            botaoMenu.setAttribute("aria-expanded", "false");
            botaoMenu.setAttribute("aria-label", "Abrir menu");

        });

    });

}


criarMenuResponsivo();


// =====================================
// SALVAR CARRINHO
// =====================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

}


// =====================================
// SAIR DA CONTA
// =====================================

function sair() {

    fetch("backend/logout.php", {
        method: "POST"
    })
    .then(function() {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
    })
    .catch(function() {
        alert("Não foi possível sair da conta.");
    });

}


// =====================================
// VARIÁVEIS DO TAMANHO
// =====================================

let produtoSelecionado = null;

let precoSelecionado = 0;

let tamanhoSelecionado = null;

let imagemSelecionada = "";


// Busca a imagem dentro do mesmo card do botão clicado.
function buscarImagemDoProduto(botao) {

    if (!botao || !botao.parentElement) {
        return "";
    }

    const imagem = botao.parentElement.querySelector("img");

    return imagem ? imagem.getAttribute("src") : "";

}


// =====================================
// CRIAR MODAL QUANDO A PÁGINA NÃO TEM
// =====================================

function criarModalTamanho() {

    const modal = document.createElement("div");

    modal.id = "modalTamanho";
    modal.className = "modal-tamanho";

    modal.innerHTML = `
        <div class="caixa-tamanho">
            <button
                type="button"
                class="fechar-tamanho"
                onclick="fecharTamanhos()"
            >
                ×
            </button>

            <h2>Escolha o tamanho</h2>
            <p id="nomeProdutoTamanho"></p>

            <div class="tamanhos">
                <button type="button" onclick="selecionarTamanho('PP', this)">PP</button>
                <button type="button" onclick="selecionarTamanho('P', this)">P</button>
                <button type="button" onclick="selecionarTamanho('M', this)">M</button>
                <button type="button" onclick="selecionarTamanho('G', this)">G</button>
                <button type="button" onclick="selecionarTamanho('GG', this)">GG</button>
            </div>

            <button
                type="button"
                class="botao-confirmar-tamanho"
                onclick="confirmarCarrinho()"
            >
                Adicionar ao Carrinho
            </button>
        </div>
    `;

    document.body.appendChild(modal);

}


// =====================================
// ABRIR MODAL DE TAMANHO
// =====================================

function abrirTamanhos(nome, preco, botao) {

    if (!document.getElementById("modalTamanho")) {
        criarModalTamanho();
    }

    produtoSelecionado = nome;

    precoSelecionado = Number(preco);

    tamanhoSelecionado = null;

    imagemSelecionada = buscarImagemDoProduto(botao);


    const nomeProduto =
        document.getElementById("nomeProdutoTamanho");

    const modal =
        document.getElementById("modalTamanho");


    if (!modal || !nomeProduto) {
        return;
    }


    nomeProduto.textContent = nome;


    document
        .querySelectorAll(".tamanhos button")
        .forEach(function(botao) {

            botao.classList.remove("selecionado");

        });


    modal.style.display = "flex";

}


// =====================================
// SELECIONAR TAMANHO
// =====================================

function selecionarTamanho(tamanho, botao) {

    tamanhoSelecionado = tamanho;


    document
        .querySelectorAll(".tamanhos button")
        .forEach(function(item) {

            item.classList.remove("selecionado");

        });


    if (botao) {

        botao.classList.add("selecionado");

    }

}


// =====================================
// FECHAR MODAL
// =====================================

function fecharTamanhos() {

    const modal =
        document.getElementById("modalTamanho");


    if (modal) {

        modal.style.display = "none";

    }

}


// =====================================
// CONFIRMAR TAMANHO E ADICIONAR
// =====================================

function confirmarCarrinho() {

    if (!produtoSelecionado) {

        return;

    }


    if (!tamanhoSelecionado) {

        alert("Escolha um tamanho antes de adicionar ao carrinho.");

        return;

    }


    adicionarCarrinho(
        produtoSelecionado,
        precoSelecionado,
        tamanhoSelecionado
    );


    fecharTamanhos();

}


// =====================================
// ADICIONAR PRODUTO AO CARRINHO
// =====================================

function adicionarCarrinho(nome, preco, tamanho, botao) {

    // Se o botão não passou tamanho,
    // abre o modal automaticamente.
    if (!tamanho) {

        abrirTamanhos(nome, preco, botao);

        return false;

    }


    const produtoExistente =
        carrinho.find(function(produto) {

            return (
                produto.nome === nome &&
                produto.tamanho === tamanho
            );

        });


    const imagem =
        buscarImagemDoProduto(botao) || imagemSelecionada;


    if (produtoExistente) {

        produtoExistente.quantidade =
            Number(produtoExistente.quantidade) + 1;

        if (imagem) {
            produtoExistente.imagem = imagem;
        }

    } else {

        carrinho.push({

            nome: nome,

            preco: Number(preco),

            tamanho: tamanho,

            imagem: imagem,

            quantidade: 1

        });

    }


    salvarCarrinho();

    atualizarCarrinho();


    mostrarAvisoCarrinho(
        nome + " - Tamanho " + tamanho
    );


    return true;

}


// =====================================
// ADICIONAR NAS PÁGINAS DAS MARCAS
// =====================================

function adicionarCarrinhoLoja(botao, nome, preco) {

    const card = botao.parentElement;
    const campoTamanho = card.querySelector("select");

    if (!campoTamanho || campoTamanho.value === "") {
        alert("Escolha um tamanho antes de adicionar ao carrinho.");
        return;
    }

    adicionarCarrinho(
        nome,
        preco,
        campoTamanho.value,
        botao
    );

}


// =====================================
// AVISO DO CARRINHO
// =====================================

function mostrarAvisoCarrinho(nome) {

    const avisoAntigo =
        document.querySelector(".aviso-carrinho");


    if (avisoAntigo) {

        avisoAntigo.remove();

    }


    const aviso =
        document.createElement("div");


    aviso.className =
        "aviso-carrinho";


    aviso.innerHTML = `

        <div class="icone-aviso">
            ✓
        </div>

        <div class="texto-aviso">

            <strong>
                Adicionado ao carrinho!
            </strong>

            <span>
                ${nome}
            </span>

        </div>

        <a href="carrinho.html">
            Ver Carrinho
        </a>

    `;


    document.body.appendChild(aviso);


    setTimeout(function() {

        aviso.classList.add("mostrar");

    }, 50);


    setTimeout(function() {

        aviso.classList.remove("mostrar");


        setTimeout(function() {

            if (aviso) {
                aviso.remove();
            }

        }, 400);

    }, 4000);

}


// =====================================
// ATUALIZAR CARRINHO
// =====================================

function atualizarCarrinho() {

    const tabela =
        document.getElementById("tabelaCarrinho");

    const totalCompra =
        document.getElementById("totalCompra");


    if (!tabela || !totalCompra) {

        return;

    }


    tabela.innerHTML = `

        <tr>

            <th>Produto</th>

            <th>Tamanho</th>

            <th>Preço</th>

            <th>Quantidade</th>

            <th>Total</th>

            <th>Remover</th>

        </tr>

    `;


    if (carrinho.length === 0) {

        tabela.innerHTML += `
            <tr class="carrinho-vazio">
                <td colspan="6">
                    Seu carrinho está vazio.
                </td>
            </tr>
        `;

    }


    let total = 0;


    carrinho.forEach(function(produto, index) {

        const preco =
            Number(produto.preco) || 0;


        const quantidade =
            Number(produto.quantidade) || 1;


        const subtotal =
            preco * quantidade;


        total += subtotal;


        tabela.innerHTML += `

            <tr>

                <td class="produto-carrinho">
                    ${produto.imagem ? `
                        <img
                            src="${produto.imagem}"
                            alt="${produto.nome}"
                            class="miniatura-carrinho"
                        >
                    ` : ""}

                    <span>${produto.nome}</span>
                </td>

                <td>
                    ${produto.tamanho || "Não informado"}
                </td>

                <td>
                    R$ ${preco
                        .toFixed(2)
                        .replace(".", ",")}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="diminuirQuantidade(${index})"
                        class="botao-quantidade"
                    >
                        -
                    </button>

                    <span class="quantidade-produto">
                        ${quantidade}
                    </span>

                    <button
                        type="button"
                        onclick="aumentarQuantidade(${index})"
                        class="botao-quantidade"
                    >
                        +
                    </button>

                </td>

                <td>
                    R$ ${subtotal
                        .toFixed(2)
                        .replace(".", ",")}
                </td>

                <td>

                    <button
                        type="button"
                        onclick="removerProduto(${index})"
                        class="botao-remover"
                    >
                        Remover
                    </button>

                </td>

            </tr>

        `;

    });


    totalCompra.innerText =
        "Total: R$ " +
        total.toFixed(2).replace(".", ",");

}


// =====================================
// AUMENTAR QUANTIDADE
// =====================================

function aumentarQuantidade(index) {

    if (!carrinho[index]) {
        return;
    }


    carrinho[index].quantidade =
        Number(carrinho[index].quantidade) + 1;


    salvarCarrinho();

    atualizarCarrinho();

}


// =====================================
// DIMINUIR QUANTIDADE
// =====================================

function diminuirQuantidade(index) {

    if (!carrinho[index]) {
        return;
    }


    carrinho[index].quantidade =
        Number(carrinho[index].quantidade) - 1;


    if (carrinho[index].quantidade <= 0) {

        carrinho.splice(index, 1);

    }


    salvarCarrinho();

    atualizarCarrinho();

}


// =====================================
// REMOVER PRODUTO
// =====================================

function removerProduto(index) {

    if (!carrinho[index]) {
        return;
    }


    carrinho.splice(index, 1);

    salvarCarrinho();

    atualizarCarrinho();

}


// =====================================
// FAVORITOS
// =====================================

let favoritos =
    JSON.parse(localStorage.getItem("favoritos")) || [];


// =====================================
// SALVAR FAVORITOS
// =====================================

function salvarFavoritos() {

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

}


// =====================================
// ADICIONAR FAVORITO
// =====================================

function adicionarFavorito(nome) {

    const produtoExiste =
        favoritos.includes(nome);


    if (produtoExiste) {

        mostrarAvisoFavorito(
            nome,
            "Já está nos favoritos!"
        );

        return;

    }


    favoritos.push(nome);

    salvarFavoritos();


    mostrarAvisoFavorito(
        nome,
        "Adicionado aos favoritos!"
    );

}


// =====================================
// MOSTRAR FAVORITOS
// =====================================

function mostrarFavoritos() {

    const modalAntigo =
        document.querySelector(".modal-favoritos");

    if (modalAntigo) {
        modalAntigo.remove();
    }

    const modal = document.createElement("div");
    modal.className = "modal-favoritos";

    let conteudo = `
        <p class="favoritos-vazio">
            Você ainda não possui produtos favoritos.
        </p>
    `;

    if (favoritos.length > 0) {

        conteudo = "<ul class=\"lista-favoritos\">";

        favoritos.forEach(function(produto) {
            conteudo += `<li><span>☆</span>${produto}</li>`;
        });

        conteudo += "</ul>";

    }

    modal.innerHTML = `
        <div class="caixa-favoritos" role="dialog" aria-modal="true">
            <button
                type="button"
                class="fechar-favoritos"
                onclick="fecharFavoritos()"
                aria-label="Fechar favoritos"
            >
                ×
            </button>

            <h2>Meus Favoritos</h2>
            <p class="subtitulo-favoritos">
                Produtos que você marcou para ver depois.
            </p>

            ${conteudo}
        </div>
    `;

    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            fecharFavoritos();
        }
    });

    document.body.appendChild(modal);

}


function fecharFavoritos() {

    const modal = document.querySelector(".modal-favoritos");

    if (modal) {
        modal.remove();
    }

}


// =====================================
// AVISO DOS FAVORITOS
// =====================================

function mostrarAvisoFavorito(nome, mensagem) {

    const avisoAntigo =
        document.querySelector(".aviso-favorito");


    if (avisoAntigo) {

        avisoAntigo.remove();

    }


    const aviso =
        document.createElement("div");


    aviso.className =
        "aviso-favorito";


    aviso.innerHTML = `

        <div class="icone-favorito">
            ♥
        </div>

        <div class="texto-favorito">

            <strong>
                ${mensagem}
            </strong>

            <span>
                ${nome}
            </span>

        </div>

    `;


    document.body.appendChild(aviso);


    setTimeout(function() {

        aviso.classList.add("mostrar");

    }, 50);


    setTimeout(function() {

        aviso.classList.remove("mostrar");


        setTimeout(function() {

            if (aviso) {
                aviso.remove();
            }

        }, 400);

    }, 3500);

}


// Coloca a estrela na mesma linha do preço em cada card.
function organizarPrecoEFavorito() {

    const produtos = document.querySelectorAll(
        "#vestidos .produto, #saias .produto, .produto-parceira"
    );

    produtos.forEach(function(produto) {

        const preco = produto.querySelector("h3");
        const botaoFavorito = produto.querySelector(
            'button[onclick^="adicionarFavorito"], .botao-favorito-produto'
        );

        if (!preco || !botaoFavorito) {
            return;
        }

        const linha = document.createElement("div");
        linha.className = "linha-preco-favorito";

        preco.parentNode.insertBefore(linha, preco);
        linha.appendChild(preco);
        linha.appendChild(botaoFavorito);

    });

}


// =====================================
// PRODUTOS PUBLICADOS PELAS PARCEIRAS
// =====================================

function carregarProdutosParceiros() {

    const secao = document.getElementById("produtos-parceiros");
    const cards = document.getElementById("cardsProdutosParceiros");

    if (!secao || !cards) {
        return;
    }

    fetch("backend/produtos_parceiros.php")
        .then(function(resposta) {
            if (!resposta.ok) {
                throw new Error("Não foi possível carregar os produtos parceiros.");
            }
            return resposta.json();
        })
        .then(function(produtos) {
            if (produtos.length === 0) {
                return;
            }

            produtos.forEach(function(produto) {
                const card = document.createElement("div");
                const nomeCompleto = produto.nome + " " + produto.marca;
                const preco = Number(produto.preco);

                card.className = "produto produto-parceira produto-publicado";

                const imagem = document.createElement("img");
                imagem.src = produto.imagem || "imagens/logo.jpeg";
                imagem.alt = produto.nome;

                const titulo = document.createElement("h2");
                titulo.textContent = produto.nome;

                const marca = document.createElement("p");
                marca.className = "marca-produto";
                marca.textContent = produto.marca;

                const estoque = document.createElement("p");
                estoque.textContent = produto.estoque + " unidades disponíveis";

                const valor = document.createElement("h3");
                valor.textContent = "R$ " + preco.toFixed(2).replace(".", ",");

                const comprar = document.createElement("button");
                comprar.type = "button";
                comprar.textContent = "Adicionar ao Carrinho";
                comprar.addEventListener("click", function() {
                    adicionarCarrinho(nomeCompleto, preco, null, comprar);
                });

                const favorito = document.createElement("button");
                favorito.type = "button";
                favorito.textContent = "Favorito";
                favorito.addEventListener("click", function() {
                    adicionarFavorito(nomeCompleto);
                });

                card.append(imagem, titulo, marca, estoque, valor, comprar, favorito);
                cards.appendChild(card);
            });

            secao.hidden = false;
            adicionarTamanhosProdutos();
            organizarPrecoEFavorito();
        })
        .catch(function(erro) {
            console.error(erro);
        });

}


// =====================================
// LOGOS DAS EMPRESAS APROVADAS
// =====================================

function carregarEmpresasParceiras() {

    const lista = document.getElementById("listaLojasParceiras");

    if (!lista) {
        return;
    }

    fetch("backend/empresas_aprovadas.php")
        .then(function(resposta) {
            if (!resposta.ok) {
                throw new Error("Não foi possível carregar as empresas parceiras.");
            }
            return resposta.json();
        })
        .then(function(empresas) {
            empresas.forEach(function(empresa) {
                const item = document.createElement("div");
                item.className = "loja loja-cadastrada";

                const link = document.createElement("a");
                link.href = "#produtos-parceiros";

                const caixaLogo = document.createElement("div");
                caixaLogo.className = "logo-loja";

                const logo = document.createElement("img");
                logo.src = empresa.logo || "imagens/logo-empresa-teste.svg";
                logo.alt = "Logo " + empresa.nome_fantasia;
                logo.addEventListener("error", function() {
                    logo.src = "imagens/logo-empresa-teste.svg";
                }, { once: true });

                const nome = document.createElement("p");
                nome.textContent = empresa.nome_fantasia;

                caixaLogo.appendChild(logo);
                link.appendChild(caixaLogo);
                item.append(link, nome);
                lista.appendChild(item);
            });
        })
        .catch(function(erro) {
            console.error(erro);
        });

}


// Deixa os produtos das lojas parceiras com o mesmo card da página inicial.
function padronizarCardsLojasParceiras() {

    const cards = document.querySelectorAll(
        ".produto-zara, .produto-farm, .produto-amaro, .produto-levis"
    );

    cards.forEach(function(card) {

        card.classList.add("produto", "produto-parceira");

        const tituloAntigo = card.querySelector("h3");
        let marca = card.querySelector(".marca-produto");
        const precoAntigo = card.querySelector(
            ".preco-zara, .preco-farm, .preco-amaro, .preco-levis"
        );
        const botaoCarrinho = card.querySelector("button");
        const labelTamanho = card.querySelector("label");
        const selectTamanho = card.querySelector("select");

        if (!tituloAntigo || !precoAntigo || !botaoCarrinho) {
            return;
        }

        const nomeProduto = tituloAntigo.textContent.trim();
        const nomeMarca = marca
            ? marca.textContent.trim()
            : document.title.split("|")[0].trim();
        const nomeCompleto = nomeProduto + " " + nomeMarca;
        const preco = Number(
            precoAntigo.textContent
                .replace("R$", "")
                .replace(".", "")
                .replace(",", ".")
                .trim()
        );

        const titulo = document.createElement("h2");
        titulo.textContent = nomeProduto;
        tituloAntigo.replaceWith(titulo);

        if (!marca) {
            marca = document.createElement("p");
            marca.className = "marca-produto";
            marca.textContent = nomeMarca;
            titulo.insertAdjacentElement("afterend", marca);
        }

        const descricao = document.createElement("p");
        descricao.textContent = "Peça selecionada da coleção " + nomeMarca + ".";
        marca.insertAdjacentElement("afterend", descricao);

        const precoNovo = document.createElement("h3");
        precoNovo.textContent = precoAntigo.textContent.trim();
        precoAntigo.replaceWith(precoNovo);

        if (labelTamanho) {
            labelTamanho.remove();
        }

        if (selectTamanho) {
            selectTamanho.remove();
        }

        botaoCarrinho.className = "botao-carrinho-produto";
        botaoCarrinho.textContent = "Adicionar ao Carrinho";
        botaoCarrinho.removeAttribute("onclick");
        botaoCarrinho.addEventListener("click", function() {
            adicionarCarrinho(nomeCompleto, preco, null, botaoCarrinho);
        });

        const botaoFavorito = document.createElement("button");
        botaoFavorito.type = "button";
        botaoFavorito.className = "botao-favorito-produto";
        botaoFavorito.textContent = "Favorito";
        botaoFavorito.addEventListener("click", function() {
            adicionarFavorito(nomeCompleto);
        });

        card.appendChild(botaoFavorito);

    });

}


// Cria a navegação horizontal dos produtos da página principal.
function criarCarrosseisProdutos() {

    const secoes = document.querySelectorAll("#vestidos, #saias");

    secoes.forEach(function(secao) {

        const cards = secao.querySelector(".cards");

        if (!cards || cards.parentElement.classList.contains("estrutura-carrossel-produtos")) {
            return;
        }

        const estrutura = document.createElement("div");
        estrutura.className = "estrutura-carrossel-produtos";

        const botaoAnterior = document.createElement("button");
        botaoAnterior.type = "button";
        botaoAnterior.className = "seta-produtos seta-produtos-anterior";
        botaoAnterior.textContent = "‹";
        botaoAnterior.setAttribute("aria-label", "Mostrar produtos anteriores");

        const botaoProximo = document.createElement("button");
        botaoProximo.type = "button";
        botaoProximo.className = "seta-produtos seta-produtos-proximo";
        botaoProximo.textContent = "›";
        botaoProximo.setAttribute("aria-label", "Mostrar próximos produtos");

        cards.parentNode.insertBefore(estrutura, cards);
        estrutura.appendChild(botaoAnterior);
        estrutura.appendChild(cards);
        estrutura.appendChild(botaoProximo);
        cards.classList.add("carrossel-produtos");

        botaoAnterior.addEventListener("click", function() {
            moverCarrosselProdutos(cards, -1);
        });

        botaoProximo.addEventListener("click", function() {
            moverCarrosselProdutos(cards, 1);
        });

    });

}


function moverCarrosselProdutos(carrossel, direcao) {

    const primeiroCard = carrossel.querySelector(".produto");

    if (!primeiroCard) {
        return;
    }

    const distancia = primeiroCard.offsetWidth + 30;

    carrossel.scrollBy({
        left: distancia * direcao,
        behavior: "smooth"
    });

}


// =====================================
// FINALIZAR COMPRA
// =====================================

const formularioCompra =
    document.getElementById("formCompra");


if (formularioCompra) {

    formularioCompra.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (carrinho.length === 0) {

                alert(
                    "Seu carrinho está vazio."
                );

                return;

            }


            const dados = new FormData(formularioCompra);

            // O carrinho é transformado em texto JSON para ser enviado ao PHP.
            dados.append(
                "carrinho",
                JSON.stringify(carrinho)
            );

            fetch("backend/finalizar_pedido.php", {
                method: "POST",
                body: dados
            })
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(resultado) {
                if (!resultado.sucesso) {
                    alert(resultado.mensagem);
                    return;
                }

                alert(
                    resultado.mensagem +
                    "\nNúmero do pedido: " +
                    resultado.pedido_id
                );

                carrinho = [];
                salvarCarrinho();
                formularioCompra.reset();

                window.location.href = "index.html";
            })
            .catch(function() {
                alert("Não foi possível finalizar o pedido.");
            });

        }
    );

}


// =====================================
// BOTÃO COMPRAR AGORA
// =====================================

const botaoBanner =
    document.querySelector("#inicio button");


if (botaoBanner) {

    botaoBanner.addEventListener(
        "click",
        function() {

            const secaoVestidos =
                document.getElementById("vestidos");


            if (secaoVestidos) {

                secaoVestidos.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


// =====================================
// NEWSLETTER
// =====================================

const formularioNewsletter =
    document.querySelector("#newsletter form");


if (formularioNewsletter) {

    formularioNewsletter.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const campoEmail =
                formularioNewsletter.querySelector(
                    'input[type="email"]'
                );

            const dados = new FormData();
            dados.append("email", campoEmail.value);

            fetch("backend/newsletter.php", {
                method: "POST",
                body: dados
            })
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(resultado) {
                alert(resultado.mensagem);

                if (resultado.sucesso) {
                    formularioNewsletter.reset();
                }
            })
            .catch(function() {
                alert("Não foi possível cadastrar o e-mail.");
            });

        }
    );

}


// =====================================
// FORMULÁRIO DE CONTATO
// =====================================

const formularioContato =
    document.getElementById("formContato");


if (formularioContato) {

    formularioContato.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const dados = new FormData(formularioContato);

            fetch("backend/contato.php", {
                method: "POST",
                body: dados
            })
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(resultado) {
                alert(resultado.mensagem);

                if (resultado.sucesso) {
                    formularioContato.reset();
                }
            })
            .catch(function() {
                alert("Não foi possível enviar a mensagem.");
            });

        }
    );

}


// =====================================
// MENU COM SCROLL
// =====================================

const linksScroll =
    document.querySelectorAll(".menu a");


const secoesScroll =
    document.querySelectorAll(
        "#inicio, #vestidos, #saias, #promocoes, #sobre, #contato"
    );


window.addEventListener(
    "scroll",
    function() {

        let secaoAtual = "inicio";


        secoesScroll.forEach(function(secao) {

            if (
                window.scrollY >=
                secao.offsetTop - 200
            ) {

                secaoAtual = secao.id;

            }

        });


        linksScroll.forEach(function(link) {

            link.classList.remove("ativo");


            if (
                link.getAttribute("href") ===
                "#" + secaoAtual
            ) {

                link.classList.add("ativo");

            }

        });

    }
);


// =====================================
// MEDIDAS DAS ROUPAS
// =====================================

function adicionarTamanhosProdutos() {

    const produtos =
        document.querySelectorAll(".produto");


    produtos.forEach(function(produto) {

        const titulo =
            produto.querySelector("h2");


        if (!titulo) {
            return;
        }


        const nomeProduto =
            titulo.innerText.trim();


        // Não adiciona medidas em cards que não são produtos.
        if (
            nomeProduto === "Vestidos" ||
            nomeProduto === "Saias" ||
            nomeProduto === "Florais" ||
            nomeProduto === "Frete Grátis"
        ) {

            return;

        }


        const botaoCarrinho =
            produto.querySelector(
                'button[onclick*="adicionarCarrinho"], .botao-carrinho-produto'
            );


        if (!botaoCarrinho) {
            return;
        }


        if (
            produto.querySelector(".botao-medidas")
        ) {

            return;

        }


        const area =
            document.createElement("div");


        area.className =
            "area-tamanho";


        area.innerHTML = `

            <button
                type="button"
                class="botao-medidas"
            >
                📏 Ver medidas
            </button>

        `;


        botaoCarrinho.parentNode.insertBefore(
            area,
            botaoCarrinho
        );


        const botaoMedidas =
            area.querySelector(".botao-medidas");


        botaoMedidas.addEventListener(
            "click",
            function() {

                mostrarMedidas(
                    nomeProduto
                );

            }
        );

    });

}


// =====================================
// MOSTRAR MEDIDAS
// =====================================

function mostrarMedidas(nomeProduto) {

    const ehSaia =
        nomeProduto
            .toLowerCase()
            .includes("saia");


    let titulo;

    let conteudo;


    if (ehSaia) {

        titulo =
            "Medidas das Saias";


        conteudo = `

            <table class="tabela-medidas">

                <tr>

                    <th>
                        Tamanho
                    </th>

                    <th>
                        Cintura
                    </th>

                    <th>
                        Quadril
                    </th>

                </tr>


                <tr>

                    <td>PP</td>

                    <td>
                        60 - 64 cm
                    </td>

                    <td>
                        86 - 90 cm
                    </td>

                </tr>


                <tr>

                    <td>P</td>

                    <td>
                        64 - 68 cm
                    </td>

                    <td>
                        90 - 94 cm
                    </td>

                </tr>


                <tr>

                    <td>M</td>

                    <td>
                        68 - 74 cm
                    </td>

                    <td>
                        94 - 100 cm
                    </td>

                </tr>


                <tr>

                    <td>G</td>

                    <td>
                        74 - 80 cm
                    </td>

                    <td>
                        100 - 106 cm
                    </td>

                </tr>


                <tr>

                    <td>GG</td>

                    <td>
                        80 - 86 cm
                    </td>

                    <td>
                        106 - 112 cm
                    </td>

                </tr>

            </table>

        `;

    } else {

        titulo =
            "Medidas dos Vestidos";


        conteudo = `

            <table class="tabela-medidas">

                <tr>

                    <th>
                        Tamanho
                    </th>

                    <th>
                        Busto
                    </th>

                    <th>
                        Cintura
                    </th>

                    <th>
                        Quadril
                    </th>

                </tr>


                <tr>

                    <td>PP</td>

                    <td>
                        80 - 84 cm
                    </td>

                    <td>
                        60 - 64 cm
                    </td>

                    <td>
                        86 - 90 cm
                    </td>

                </tr>


                <tr>

                    <td>P</td>

                    <td>
                        84 - 88 cm
                    </td>

                    <td>
                        64 - 68 cm
                    </td>

                    <td>
                        90 - 94 cm
                    </td>

                </tr>


                <tr>

                    <td>M</td>

                    <td>
                        88 - 94 cm
                    </td>

                    <td>
                        68 - 74 cm
                    </td>

                    <td>
                        94 - 100 cm
                    </td>

                </tr>


                <tr>

                    <td>G</td>

                    <td>
                        94 - 100 cm
                    </td>

                    <td>
                        74 - 80 cm
                    </td>

                    <td>
                        100 - 106 cm
                    </td>

                </tr>


                <tr>

                    <td>GG</td>

                    <td>
                        100 - 106 cm
                    </td>

                    <td>
                        80 - 86 cm
                    </td>

                    <td>
                        106 - 112 cm
                    </td>

                </tr>

            </table>

        `;

    }


    const modal =
        document.createElement("div");


    modal.className =
        "modal-medidas";


    modal.innerHTML = `

        <div class="caixa-medidas">

            <button
                type="button"
                class="fechar-medidas"
            >
                ×
            </button>

            <h2>
                ${titulo}
            </h2>

            ${conteudo}

            <p>
                As medidas podem variar de acordo
                com a modelagem de cada peça.
            </p>

        </div>

    `;


    document.body.appendChild(modal);


    const botaoFechar =
        modal.querySelector(".fechar-medidas");


    botaoFechar.addEventListener(
        "click",
        function() {

            modal.remove();

        }
    );


    modal.addEventListener(
        "click",
        function(event) {

            if (event.target === modal) {

                modal.remove();

            }

        }
    );

}


// =====================================
// PESQUISA
// =====================================

const campoPesquisa =
    document.getElementById("campoPesquisa");


function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}


function filtrarProdutos() {

    const produtos = document.querySelectorAll(
        "#vestidos .produto, #saias .produto"
    );

    const pesquisa = normalizarTexto(campoPesquisa.value);
    const termos = pesquisa.split(/\s+/).filter(Boolean);
    let primeiroResultado = null;

    produtos.forEach(function(produto) {

        const secao = produto.closest("section");
        const categoria = secao && secao.id === "saias"
            ? "saia saias"
            : "vestido vestidos";

        const textoProduto = normalizarTexto(
            produto.innerText + " " + categoria
        );

        const corresponde = termos.every(function(termo) {
            return textoProduto.includes(termo);
        });

        produto.hidden = !corresponde;

        if (corresponde && !primeiroResultado) {
            primeiroResultado = produto;
        }

    });

    return primeiroResultado;

}


function realizarPesquisa() {

    if (!campoPesquisa) {
        return;
    }

    const primeiroResultado = filtrarProdutos();

    if (primeiroResultado && campoPesquisa.value.trim() !== "") {

        primeiroResultado.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


// =====================================
// ENTER NA PESQUISA
// =====================================

if (campoPesquisa) {

    campoPesquisa.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                realizarPesquisa();

            }

        }
    );

}


// =====================================
// PESQUISA ENQUANTO DIGITA
// =====================================

if (campoPesquisa) {

    campoPesquisa.addEventListener(
        "input",
        function() {

            filtrarProdutos();

        }
    );

}


// =====================================
// CARROSSEL DA PÁGINA INICIAL
// =====================================

let slideAtual = 0;
let tempoCarrossel = null;


function mostrarSlide(indice) {

    const slides = document.querySelectorAll(".slide-carrossel");
    const indicadores = document.querySelectorAll(
        ".indicadores-carrossel button"
    );

    if (slides.length === 0) {
        return;
    }

    if (indice >= slides.length) {
        slideAtual = 0;
    } else if (indice < 0) {
        slideAtual = slides.length - 1;
    } else {
        slideAtual = indice;
    }

    slides.forEach(function(slide) {
        slide.classList.remove("slide-ativo");
    });

    indicadores.forEach(function(indicador) {
        indicador.classList.remove("indicador-ativo");
    });

    slides[slideAtual].classList.add("slide-ativo");

    if (indicadores[slideAtual]) {
        indicadores[slideAtual].classList.add("indicador-ativo");
    }

}


function iniciarCarrossel() {

    const slides = document.querySelectorAll(".slide-carrossel");

    if (slides.length < 2) {
        return;
    }

    clearInterval(tempoCarrossel);

    tempoCarrossel = setInterval(function() {
        mostrarSlide(slideAtual + 1);
    }, 5000);

}


function mudarSlide(direcao) {

    mostrarSlide(slideAtual + direcao);
    iniciarCarrossel();

}


function irParaSlide(indice) {

    mostrarSlide(indice);
    iniciarCarrossel();

}


// =====================================
// INICIAR SITE
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        padronizarCardsLojasParceiras();

        adicionarTamanhosProdutos();

        organizarPrecoEFavorito();

        carregarProdutosParceiros();

        carregarEmpresasParceiras();

        atualizarCarrinho();

        iniciarCarrossel();

        criarCarrosseisProdutos();

    }
);


// =====================================
// EFEITO SCROLL
// =====================================

const elementosScroll =
    document.querySelectorAll("main section");


elementosScroll.forEach(function(elemento) {

    elemento.classList.add(
        "efeito-scroll"
    );

});


if ("IntersectionObserver" in window) {

    const observadorScroll =
        new IntersectionObserver(
            function(elementos) {

                elementos.forEach(
                    function(elemento) {

                        if (elemento.isIntersecting) {

                            elemento.target.classList.add(
                                "aparecer"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    elementosScroll.forEach(function(elemento) {

        observadorScroll.observe(elemento);

    });

}


// =====================================
// EFEITO REVEAL
// =====================================

const elementosReveal =
    document.querySelectorAll(
        ".titulo, .produto, .sobre-texto, .rodape-coluna"
    );


const imagensReveal =
    document.querySelectorAll(
        ".colecao-card, .logoBanner"
    );


elementosReveal.forEach(function(elemento) {

    elemento.classList.add(
        "scroll-reveal"
    );

});


imagensReveal.forEach(function(elemento) {

    elemento.classList.add(
        "scroll-imagem"
    );

});


if ("IntersectionObserver" in window) {

    const observerReveal =
        new IntersectionObserver(
            function(entries) {

                entries.forEach(
                    function(entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "aparecer"
                            );


                            observerReveal.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elementosReveal.forEach(function(elemento) {

        observerReveal.observe(elemento);

    });


    imagensReveal.forEach(function(elemento) {

        observerReveal.observe(elemento);

    });

}


// =====================================
// ANIMAÇÃO DAS ABAS
// =====================================

const linksMenuAnimacao =
    document.querySelectorAll(".menu a");


linksMenuAnimacao.forEach(function(link) {

    link.addEventListener(
        "click",
        function() {

            const destinoId =
                link.getAttribute("href");


            if (!destinoId.startsWith("#")) {
                return;
            }


            const secao =
                document.querySelector(destinoId);


            if (!secao) {
                return;
            }


            secao.classList.remove(
                "animar-secao"
            );


            void secao.offsetWidth;


            secao.classList.add(
                "animar-secao"
            );


            setTimeout(function() {

                secao.classList.remove(
                    "animar-secao"
                );

            }, 800);

        }
    );

});


// =====================================
// ANIMAÇÕES DOS TÍTULOS
// =====================================

const titulosScroll =
    document.querySelectorAll(
        ".titulo, .titulo-colecao"
    );


titulosScroll.forEach(function(elemento) {

    elemento.classList.add(
        "scroll-item",
        "scroll-baixo"
    );

});


// =====================================
// ANIMAÇÕES DOS PRODUTOS
// =====================================

const produtosScroll =
    document.querySelectorAll(".produto");


produtosScroll.forEach(
    function(elemento, index) {

        elemento.classList.add(
            "scroll-item"
        );


        if (index % 2 === 0) {

            elemento.classList.add(
                "scroll-esquerda"
            );

        } else {

            elemento.classList.add(
                "scroll-direita"
            );

        }

    }
);


// =====================================
// ANIMAÇÕES COLEÇÃO
// =====================================

const colecaoScroll =
    document.querySelectorAll(
        ".colecao-card"
    );


colecaoScroll.forEach(function(elemento) {

    elemento.classList.add(
        "scroll-item",
        "scroll-zoom"
    );

});


// =====================================
// ANIMAÇÕES SOBRE
// =====================================

const sobreScroll =
    document.querySelectorAll(
        ".sobre-texto"
    );


sobreScroll.forEach(function(elemento) {

    elemento.classList.add(
        "scroll-item",
        "scroll-baixo"
    );

});


// =====================================
// CONTATO E RODAPÉ
// =====================================

const outrosScroll =
    document.querySelectorAll(
        "#contato p, .rodape-coluna"
    );


outrosScroll.forEach(
    function(elemento, index) {

        elemento.classList.add(
            "scroll-item"
        );


        if (index % 2 === 0) {

            elemento.classList.add(
                "scroll-esquerda"
            );

        } else {

            elemento.classList.add(
                "scroll-direita"
            );

        }

    }
);


// =====================================
// OBSERVADOR DAS ANIMAÇÕES
// =====================================

if ("IntersectionObserver" in window) {

    const observerScrollAnimado =
        new IntersectionObserver(
            function(entries) {

                entries.forEach(
                    function(entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "aparecer"
                            );


                            observerScrollAnimado.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    produtosScroll.forEach(function(elemento) {

        observerScrollAnimado.observe(
            elemento
        );

    });


    titulosScroll.forEach(function(elemento) {

        observerScrollAnimado.observe(
            elemento
        );

    });


    colecaoScroll.forEach(function(elemento) {

        observerScrollAnimado.observe(
            elemento
        );

    });


    sobreScroll.forEach(function(elemento) {

        observerScrollAnimado.observe(
            elemento
        );

    });


    outrosScroll.forEach(function(elemento) {

        observerScrollAnimado.observe(
            elemento
        );

    });

}
