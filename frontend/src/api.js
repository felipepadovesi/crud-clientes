const API = 'http://localhost:3333/clientes';

export async function requisicao(caminho = '', opcoes = {}) {
    let resposta;
    
    try {
        resposta = await fetch(API + caminho, opcoes);
    } catch {
        throw new Error('Não foi possível acessar a API.');
    }

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Erro na requisição.');
    }

    return dados;
}