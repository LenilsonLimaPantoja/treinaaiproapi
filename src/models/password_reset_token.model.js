const passwordResetTokenRepository = require('../repositories/password_reset_token.repository');
class PasswordResetTokens {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.token_hash = data.token_hash;
        this.expires_at = data.expires_at;
        this.created_at = data.created_at;
        this.used_at = data.used_at;
        this.request_ip = data.request_ip;
        this.user_agent = data.user_agent;
    }

    async save() {
        return await passwordResetTokenRepository.save(this);
    }

    static async readTentativasResetSenha(user_id, request_ip) {
        return await passwordResetTokenRepository.readTentativasResetSenha(user_id, request_ip);
    }

    static async verificaToken(token) {
        return passwordResetTokenRepository.verificaToken(token);
    }

    static async updateTokenResetSenha(id) {
        return passwordResetTokenRepository.updateTokenResetSenha(id);
    }
}

module.exports = PasswordResetTokens;