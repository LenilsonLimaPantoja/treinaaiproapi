const usuarioService = require("../services/usuario.service");

exports.create = async (req, res, next) => {
    try {
        const body = req.body;

        const usuario = await usuarioService.save(body);

        if (usuario.codigo !== 201) {
            return res.status(usuario.codigo).send({
                retorno: {
                    status: usuario.codigo,
                    mensagem: usuario.mensagem
                },
                registros: []
            });
        }

        return res.status(201).send({
            retorno: {
                status: 201,
                mensagem: usuario.mensagem
            },
            registros: [{ id: usuario.id }]
        });
    } catch (error) {
        return res.status(500).send({
            retorno: {
                status: 500,
                mensagem: 'Erro ao criar usuário. Tente novamente.'
            },
            registros: []
        });
    }
}

exports.updateMe = async (req, res, next) => {
    try {
        let body = req.body;
        const { id } = req.usuario;
        body.id = id;

        const usuario = await usuarioService.updateMe(body);

        if (usuario.codigo !== 200) {
            return res.status(usuario.codigo).send({
                retorno: {
                    status: usuario.codigo,
                    mensagem: usuario.mensagem
                },
                registros: []
            });
        }

        return res.status(200).send({
            retorno: {
                status: 200,
                mensagem: usuario.mensagem
            },
            registros: [{ id: usuario.id }]
        });
    } catch (error) {
        return res.status(500).send({
            retorno: {
                status: 500,
                mensagem: 'Erro ao atualizar usuário. Tente novamente.'
            },
            registros: []
        });
    }
}

exports.me = async (req, res, next) => {
    try {
        const { id } = req.usuario;

        const usuario = await usuarioService.me(id);

        if (usuario.codigo !== 200) {
            return res.status(usuario.codigo).send({
                retorno: {
                    status: usuario.codigo,
                    mensagem: usuario.mensagem
                },
                registros: []
            });
        }

        return res.status(200).send({
            retorno: {
                status: 200,
                mensagem: usuario.mensagem
            },
            registros: usuario.dados
        });
    } catch (error) {
        return res.status(500).send({
            retorno: {
                status: 500,
                mensagem: 'Erro ao buscar usuário. Tente novamente.'
            },
            registros: []
        });
    }
}

exports.readAll = async (req, res, next) => {
    try {
        const { filtro } = req.query;

        const usuario = await usuarioService.readAll(filtro);

        if (usuario.codigo !== 200) {
            return res.status(usuario.codigo).send({
                retorno: {
                    status: usuario.codigo,
                    mensagem: usuario.mensagem
                },
                registros: []
            });
        }

        return res.status(200).send({
            retorno: {
                status: 200,
                mensagem: usuario.mensagem
            },
            registros: usuario.dados
        });
    } catch (error) {
        return res.status(500).send({
            retorno: {
                status: 500,
                mensagem: 'Erro ao buscar usuários. Tente novamente.'
            },
            registros: []
        });
    }
}

exports.deleteMe = async (req, res, next) => {
    try {
        const { id } = req.usuario;

        const usuario = await usuarioService.deleteMe(id);

        if (usuario.codigo !== 200) {
            return res.status(usuario.codigo).send({
                retorno: {
                    status: usuario.codigo,
                    mensagem: usuario.mensagem
                },
                registros: []
            });
        }

        return res.status(200).send({
            retorno: {
                status: 200,
                mensagem: usuario.mensagem
            },
            registros: [{ id: usuario.id }]
        });
    } catch (error) {
        return res.status(500).send({
            retorno: {
                status: 500,
                mensagem: 'Erro ao excluir usuário. Tente novamente.'
            },
            registros: []
        });
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;
        const result = await usuarioService.login(email, senha);

        if (result.codigo !== 200) {
            return res.status(result.codigo).send({
                retorno: {
                    status: result.codigo,
                    mensagem: result.mensagem
                },
                registros: []
            });
        }

        return res.status(200).send({
            retorno: {
                status: 200,
                mensagem: result.mensagem
            },
            registros: result.dados
        });
    } catch (error) {
        return res.status(500).send({
            retorno: {
                status: 500,
                mensagem: 'Erro ao fazer login, tente novamente.'
            },
            registros: []
        });
    }
};