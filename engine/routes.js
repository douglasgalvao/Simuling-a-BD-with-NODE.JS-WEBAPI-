let express = require("express");

let webApi = express();
webApi.use(express.json());

var alunos = [{
    "id": "1234",
    "nome": "TesteAluno01",
    "idade": 23
}, {
    "id": "12345",
    "nome": "TesteAluno02",
    "idade": 23
}, {
    "id": "123456",
    "nome": "TesteAluno03",
    "idade": 23
}, {
    "id": "1234567",
    "nome": "TesteAluno04",
    "idade": 23
}, {
    "id": "12345678",
    "nome": "TesteAluno05",
    "idade": 23
}];


/** Essa rota recebe um { id } de entrada e retorna o objeto correspondente ao id especificado. */
webApi.get("/searchAluno", (req, resp) => {
    let requisition = req.body;
    if (requisition["id"] && typeof (requisition.id) == 'string') {
        if (alunos.find(e => e.id == requisition.id)) {
            return resp.status(200).json(alunos.find(e => e.id == requisition.id));
        } else {
            return resp.status(401).json({
                response: "Aluno não encontrado"
            });
        }
    }
});

/** Essa rota não recebe parametros de entrada , e retorna todos objetos da lista aluno caso exista. */

webApi.get("/getAlunos", (req, resp) => {  // observe que a requisição não é usada nesses casos

    if (alunos.length > 0) {
        return resp.status(200).json({
            response: alunos.sort((a, b) => {
                if (a.id < b.id) return -1;
                else if (a.id < b.id) return 1;
                else return 0;
            })
        });
    } else {
        return resp.status(200).json({ // retorno de uma requisição sucedida (200) porém sem resultado de retorno da lista alunos.
            response: "Nenhum aluno cadastrado."
        });
    }

});

/**Essa rota recebe um input {id,nome,idade} e Cadastra na lista alunos*/
webApi.post("/putAluno", (req, resp) => {
    let requisition = req.body;
    if (requisition["id"] && requisition["nome"] && requisition["idade"] &&
        requisition.id != "" && requisition.nome != "" && typeof (requisition.idade) == "number" &&  /** validação de campos(parâmetros de entrada) para a criação de um objeto aluno na lista alunos.*/
        requisition.idade > 0) {
        if (!alunos.find(e => e.id == requisition.id)) {
            alunos.push(req.body);
            return resp.status(200).json({
                response: "Aluno cadastrado com sucesso!.",
                status: "200 - OK"
            });
        } else {
            return resp.status(200).json({
                response: "Erro no cadastro, Aluno com id existente",
                status: "200 - OK"
            });
        }
    } else {
        return resp.status(401).json({
            response: "Parametros faltantes , erro no cadastro!"
        });
    }
});
/**Essa rota recebe um input {id} e deleta o objeto na lista de alunos caso o id inputado tenha equivalencia dentro de algum objeto na lista de alunos. */
webApi.delete("/deleteAluno", (req, resp) => {
    let requisition = req.body;

    if (requisition["id"] && typeof (requisition.id) == 'string') {
        if (alunos.find(e => e.id == requisition.id)) {
            let messageDeleted = alunos.find(e => e.id == requisition.id);
            alunos = alunos.filter(e => e.id != requisition.id);
            return resp.status(200).json({
                deleted: messageDeleted,
                response: "Aluno has been deleted with success!"
            });

        } else {
            return resp.status(404).json({
                response: "Aluno not found to delete"
            });
        }
    }
});

webApi.patch("/patchAluno", (req, resp) => {
    let requisition = req.body;
    if (requisition["id"] && alunos.find(e => e.id == requisition.id)) {
        let position = alunos.indexOf(alunos.find(e => e.id == requisition.id));
        if(position > -1){
            alunos[position].nome = requisition["nome"] && requisition.nome != "" ? requisition.nome : alunos[position].nome;
            alunos[position].idade = requisition["idade"] && requisition.idade != "" ? requisition.idade : alunos[position].idade;
            return resp.status(200).json({
                response: alunos[position],
                status: "200 - Aluno has been patched with success!"
            });
        }

        return resp.status(200).json({
            response: "Error on patch",
            status: "200 - OK"
        });

    } else {
        return resp.status(401).json({
            response: "Parametros faltantes , erro no cadastro!"
        });
    }
});


webApi.listen(8080, () => {
    console.log("Servidor is online at port 8080");
});