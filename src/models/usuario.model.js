const usuarioRepository = require('../repositories/usuario.repository');

class Usuarios {
    constructor(data) {
        this.id = data.id;
        this.nome = data.nome;
        this.email = data.email;
        this.senha = data.senha;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    async save() {
        return await usuarioRepository.save(this);
    }

    async updateMe() {
        return await usuarioRepository.updateMe(this);
    }

    static async readAll(filtro) {
        return await usuarioRepository.readAll(filtro);
    }

    static async login(usuario, senha) {
        return await usuarioRepository.login(usuario, senha);
    }

    static async me(id) {
        return await usuarioRepository.me(id);
    }

    static async readOneSaveMe(email) {
        return await usuarioRepository.readOneSaveMe(email);
    }

    static async readOneUpdateMe(email, id) {
        return await usuarioRepository.readOneUpdateMe(email, id);
    }

    static async deleteMe(id) {
        return await usuarioRepository.deleteMe(id);
    }
}

module.exports = Usuarios;