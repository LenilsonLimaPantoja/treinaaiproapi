const Usuarios = require("../models/usuario.model");
const errorUtil = require("../utils/error.util");
const bcrypt = require('bcrypt');
const { schemaCreateUsuario, schemaUpdateMeUsuario, schemaReadMeAndDeleteMeUsuario, schemaReadAllUsuario, schemaLoginUsuario } = require("../validators/usuario.schema");

const usuarioService = {
    save: async (data) => {
        try {
            await schemaCreateUsuario.validate(data, { abortEarly: false });

            const usuarioExiste = await Usuarios.readOneSaveMe(data.email);

            if (usuarioExiste.length > 0) {
                return { codigo: 409, mensagem: 'Usuário já existe. Tente novamente.' };
            }

            const hashedSenha = await bcrypt.hash(data.senha, 10);
            data.senha = hashedSenha;

            const usuario = new Usuarios(data);
            const id = await usuario.save();

            return { codigo: 201, id: id, mensagem: 'Usuário criado com sucesso.' };
        } catch (error) {
            return errorUtil.respostaErroService(error);
        }
    },
    updateMe: async (data) => {
        try {
            await schemaUpdateMeUsuario.validate(data, { abortEarly: false });

            const usuarioExisteMe = await Usuarios.me(data.id);

            if (usuarioExisteMe.length === 0) {
                return { codigo: 404, mensagem: 'Nenhum usuário encontrado. Tente novamente.' };
            }

            const usuarioExiste = await Usuarios.readOneUpdateMe(data.email, data.id);

            if (usuarioExiste.length > 0) {
                return { codigo: 409, mensagem: 'Usuário já existe. Tente novamente.' };
            }

            const usuario = new Usuarios(data);
            const id = await usuario.updateMe();

            return { codigo: 200, id: id, mensagem: 'Usuário atualizado com sucesso.' };
        } catch (error) {
            return errorUtil.respostaErroService(error);
        }
    },
    readAll: async (filtro) => {
        try {
            await schemaReadAllUsuario.validate({ filtro: filtro }, { abortEarly: false });

            filtro = filtro?.trim() || null;

            const usuario = await Usuarios.readAll(filtro);

            if (usuario.length === 0) {
                return { codigo: 404, mensagem: 'Nenhum usuário encontrado. Tente novamente.' };
            }

            return { codigo: 200, mensagem: 'Usuários encontrados com sucesso.', dados: usuario };
        } catch (error) {
            console.log(error);

            return errorUtil.respostaErroService(error);
        }
    },
    me: async (id) => {
        try {
            await schemaReadMeAndDeleteMeUsuario.validate({ id: id }, { abortEarly: false });

            const usuario = await Usuarios.me(id);

            if (usuario.length === 0) {
                return { codigo: 404, mensagem: 'Nenhum usuário encontrado. Tente novamente.' };
            }

            return { codigo: 200, mensagem: 'Usuário encontrados com sucesso.', dados: usuario };
        } catch (error) {
            return errorUtil.respostaErroService(error);
        }
    },
    deleteMe: async (id) => {
        try {
            await schemaReadMeAndDeleteMeUsuario.validate({ id: id }, { abortEarly: false });

            const usuario = await Usuarios.me(id);

            if (usuario.length === 0) {
                return { codigo: 404, mensagem: 'Nenhum usuário encontrado. Tente novamente.' };
            }

            const usuarioDelete = await Usuarios.deleteMe(id);

            return { codigo: 200, mensagem: 'Usuário excluido com sucesso.', id: usuarioDelete };
        } catch (error) {
            return errorUtil.respostaErroService(error);
        }
    },
    login: async (email, senha) => {
        try {
            await schemaLoginUsuario.validate({ email: email, senha: senha }, { abortEarly: false });

            const usuario = await Usuarios.readOneSaveMe(email);

            if (usuario.length === 0) {
                return { codigo: 401, mensagem: 'Falha na autenticação, os dados informados são invalidos.' };
            }

            const result = await Usuarios.login(usuario, senha);
            if (result.codigo === 401) {
                return { codigo: 401, mensagem: 'Falha na autenticação, os dados informados são invalidos.' };
            }

            return { codigo: 200, mensagem: 'Usuário autenticado com sucesso.', dados: result.dados };
        } catch (error) {
            console.log(error);

            return errorUtil.respostaErroService(error);
        }
    },
}

module.exports = usuarioService;