const passwordResetTokenService = require("../services/password_reset_token.service");

exports.create = async (req, res, next) => {
    try {
        let body = req.body;

        const request_ip =
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.socket.remoteAddress ||
            "0.0.0.0";

        const user_agent = req.headers["user-agent"] || "unknown";

        body.request_ip = request_ip;
        body.user_agent = user_agent;


        const token = await passwordResetTokenService.save(body);

        if (token.codigo !== 201) {
            return res.status(token.codigo).send({
                retorno: {
                    status: token.codigo,
                    mensagem: token.mensagem
                },
                registros: []
            });
        }

        return res.status(201).send({
            retorno: {
                status: 201,
                mensagem: token.mensagem
            },
            registros: [
                {
                    id: token.id,
                    token: token.token
                }
            ]
        });
    } catch (error) {
        return res.status(500).send({
            retorno: {
                status: 500,
                mensagem: 'Erro ao gerar token. Tente novamente.'
            },
            registros: []
        });
    }
}

exports.verificaToken = async (req, res) => {
    try {
        const { token } = req.params;

        const tokenDados = await passwordResetTokenService.verificaToken(token);

        if (tokenDados.codigo !== 200) {
            return res.redirect(
                `treinaaipro://login?msg=${encodeURIComponent(tokenDados.mensagem)}`
            );
        }

        return res.redirect(
            `treinaaipro://alterar-senha?token=${encodeURIComponent(token)}`
        );

    } catch (error) {
        return res.redirect(
            `treinaaipro://login?msg=${encodeURIComponent("Erro ao validar token. Tente novamente.")}`
        );
    }
};