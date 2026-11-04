function validarCliente(req, res, next) {
    const { nome, email, telefone } = req.body || {};
    const campos = [nome, email, telefone];
    const preenchidos = campos.every(campo =>
        typeof campo === 'string' && campo.trim() !== ''
    );
    
    if (!preenchidos) {
        return res.status(400).json({
            mensagem: 'Preencha nome, e-mail e telefone.'
        });
    }

    const cliente = {
        nome: nome.trim(), email: email.trim(),
        telefone: telefone.trim()
    };

    if (cliente.nome.length > 100 ||
            cliente.email.length > 150 ||
            cliente.telefone.length > 20 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
        return res.status(400).json({
            mensagem: 'Confira o e-mail e o tamanho dos campos.'
        });
    }

    req.body = cliente;
    next();
}

module.exports = validarCliente;
