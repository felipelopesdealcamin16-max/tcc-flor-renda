// =====================================
// FAVORITOS
// =====================================

let favoritos = [];


// ADICIONAR PRODUTO AOS FAVORITOS

function adicionarFavorito(nome){

    const produtoJaExiste =
        favoritos.includes(nome);

    if(produtoJaExiste){

        alert(
            nome +
            " já está na sua lista de favoritos."
        );

        return;

    }

    favoritos.push(nome);

    alert(
        nome +
        " foi adicionado aos favoritos."
    );

}


// MOSTRAR LISTA DE FAVORITOS

function mostrarFavoritos(){

    if(favoritos.length === 0){

        alert(
            "Você ainda não adicionou nenhum produto aos favoritos."
        );

        return;

    }

    let mensagem =
        "Seus produtos favoritos:\n\n";

    favoritos.forEach(
        (produto, index) => {

            mensagem +=
                (index + 1) +
                ". " +
                produto +
                "\n";

        }
    );

    alert(mensagem);

}


// REMOVER PRODUTO DOS FAVORITOS

function removerFavorito(nome){

    const posicao =
        favoritos.indexOf(nome);

    if(posicao === -1){

        alert(
            "Esse produto não está nos favoritos."
        );

        return;

    }

    favoritos.splice(posicao, 1);

    alert(
        nome +
        " foi removido dos favoritos."
    );

}