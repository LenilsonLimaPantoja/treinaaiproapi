const PasswordResetTokens = require("../models/password_reset_token.model");
const Usuarios = require("../models/usuario.model");
const errorUtil = require("../utils/error.util");
const crypto = require("crypto");
const sendEmailResetPassword = require("../utils/send_email_reset_password.util");

const passwordResetTokenService = {
    save: async (data) => {
        try {
            const usuario = await Usuarios.readOneSaveMe(data.email);

            if (usuario.length === 0) {
                return {
                    codigo: 200,
                    mensagem: "Enviamos as instruções de alteração para o e-mail informado, verifique sua caixa de entrada."
                };
            }

            const user_id = usuario[0]?.id;

            const { tentativas_user, tentativas_ip } =
                await PasswordResetTokens.readTentativasResetSenha(user_id, data.request_ip);

            if (tentativas_user >= 3 || tentativas_ip >= 3) {
                return { codigo: 200, mensagem: "Muitas tentativas. Tente novamente em alguns minutos." };
            }

            const token = crypto.randomBytes(32).toString("base64url");
            const token_hash = crypto.createHash("sha256").update(token).digest("hex");
            const expires_at = new Date(Date.now() + 10 * 60 * 1000);

            data.expires_at = expires_at;
            data.token_hash = token_hash;
            data.user_id = user_id;

            const password_reset_tokens = new PasswordResetTokens(data);
            const id = await password_reset_tokens.save();

            await sendEmailResetPassword(data.email, token);
            return {
                codigo: 201,
                id,
                mensagem: "Enviamos as instruções de alteração para o e-mail informado, verifique sua caixa de entrada."
            };
        } catch (error) {
            return errorUtil.respostaErroService(error);
        }
    },
    verificaToken: async (token) => {
        try {
            const tokenDados = await PasswordResetTokens.verificaToken(token);

            if (tokenDados.length === 0) {
                return {
                    codigo: 401,
                    mensagem: "Token inválido ou não encontrado. Solicite uma nova redefinição de senha e tente novamente."
                };
            }

            if (tokenDados[0].used_at) {
                return {
                    codigo: 401,
                    mensagem: "Este token já foi utilizado anteriormente. Por segurança, solicite uma nova redefinição de senha."
                };
            }

            if (new Date(tokenDados[0].expires_at) <= new Date()) {
                return {
                    codigo: 401,
                    mensagem: "Token expirado. O prazo de validade foi atingido. Solicite um novo link para redefinir sua senha."
                };
            }

            return {
                codigo: 200,
                token: tokenDados[0],
                mensagem: "Token confirmado com sucesso! Agora você pode cadastrar uma nova senha para concluir a alteração."
            };
        } catch (error) {
            return errorUtil.respostaErroService(error);
        }
    },
}

module.exports = passwordResetTokenService;
