import { useEffect, useState } from 'react';
import { requisicao } from './api';
import './App.css';

const vazio = { nome: '', email: '', telefone: '' };

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(vazio);
  const [idEdicao, setIdEdicao] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    let ativo = true;
    requisicao()
      .then(retorno => {
        if (ativo) setClientes(retorno.dados);
      })
      .catch(erro => {
        if (ativo) setMensagem(erro.message);
      });
    return () => { ativo = false; };
  }, []);

  async function carregarClientes() {
    const retorno = await requisicao();
    setClientes(retorno.dados);
  }

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    setForm({ ...form, [name]: value });
  }

  function limpar() {
    setForm(vazio);
    setIdEdicao(null);
  }

  function editar(cliente) {
    setForm({ nome: cliente.nome, email: cliente.email,
    telefone: cliente.telefone });
    setIdEdicao(cliente.id);
    setMensagem('Edite os campos e salve as alterações.');
  }

  async function salvar(evento) {
    evento.preventDefault();
    setOcupado(true);

    try {
      const caminho = idEdicao === null ? '' : `/${idEdicao}`;

      await requisicao(caminho, {
        method: idEdicao === null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      limpar();
      await carregarClientes();
      setMensagem('Cliente salvo com sucesso.');
    } catch (erro) {
      setMensagem(erro.message);
    } finally {
      setOcupado(false);
    }
  }

  async function excluir(id) {
    if (!window.confirm('Deseja excluir este cliente?')) return;
    setOcupado(true);
    try {
      await requisicao(`/${id}`, { method: 'DELETE' });
      if (idEdicao === id) limpar();
      await carregarClientes();
      setMensagem('Cliente excluído.');
    } catch (erro) {
      setMensagem(erro.message);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <main>

      <h1>Cadastro de clientes</h1>
      
      <form onSubmit={salvar}>
        <fieldset disabled={ocupado}>

          <legend>{idEdicao === null ? 'Novo cliente' :
        'Editar cliente'}</legend>

          <label>Nome
            <input name="nome" value={form.nome}
            onChange={alterarCampo} maxLength={100} required />
          </label>

          <label>E-mail
            <input name="email" type="email" value={form.email}
            onChange={alterarCampo} maxLength={150} required />
          </label>

          <label>Telefone
            <input name="telefone" type="tel"
            value={form.telefone} onChange={alterarCampo}
            maxLength={20} required />
          </label>

          <div className="acoes">
            <button type="submit">
              {ocupado ? 'Aguarde...' : idEdicao === null ?
              'Cadastrar' : 'Salvar alterações'}
            </button>

            {idEdicao !== null && <button type="button"
            onClick={limpar}>Cancelar</button>}
          </div>
        </fieldset>
      </form>
      <p role="status">{mensagem}</p>

      <h2>Clientes cadastrados</h2>
      <div className="tabela">
        <table>
          <thead><tr>
            <th>ID</th><th>Nome</th><th>E-mail</th>
            <th>Telefone</th><th>Ações</th>
          </tr></thead>
          <tbody>
            {clientes.length === 0 && <tr>
              <td colSpan={5}>Nenhum cliente cadastrado.</td>
            </tr>}

            {clientes.map(cliente => <tr key={cliente.id}>
              <td>{cliente.id}</td><td>{cliente.nome}</td>
              <td>{cliente.email}</td><td>{cliente.telefone}</td>
              <td>
                <button disabled={ocupado} type="button"
                onClick={() => editar(cliente)}>Editar</button>

                <button disabled={ocupado} type="button"
                onClick={() => excluir(cliente.id)}>Excluir</button>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </main>
  );
}


