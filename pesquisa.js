// =====================================
// PESQUISA DE PRODUTOS
// =====================================

function pesquisarProduto(){

    const campoPesquisa =
        document.getElementById("campoPesquisa");

    if(!campoPesquisa){
        return;
    }

    const textoPesquisa =
        campoPesquisa.value
        .trim()
        .toLowerCase();

    const produtos =
        document.querySelectorAll(".produto");

    let quantidadeEncontrada = 0;

    produtos.forEach(produto => {

        const titulo =
            produto.querySelector("h2");

        if(!titulo){
            return;
        }

        const nomeProduto =
            titulo.innerText
            .toLowerCase();

        const encontrou =
            nomeProduto.includes(textoPesquisa);

        produto.style.display =
            encontrou ? "flex" : "none";

        if(encontrou){
            quantidadeEncontrada++;
        }

    });

    if(textoPesquisa === ""){

        produtos.forEach(produto => {
            produto.style.display = "flex";
        });

        return;
    }

    if(quantidadeEncontrada === 0){

        alert("Nenhum produto foi encontrado.");

    }

}


// PESQUISAR AO APERTAR ENTER

const campoPesquisa =
    document.getElementById("campoPesquisa");

if(campoPesquisa){

    campoPesquisa.addEventListener(
        "keydown",
        function(event){

            if(event.key === "Enter"){

                event.preventDefault();

                pesquisarProduto();

            }

        }
    );

}


// MOSTRAR TUDO QUANDO APAGAR A PESQUISA

if(campoPesquisa){

    campoPesquisa.addEventListener(
        "input",
        function(){

            if(campoPesquisa.value.trim() === ""){

                document
                .querySelectorAll(".produto")
                .forEach(produto => {

                    produto.style.display = "flex";

                });

            }

        }
    );

}