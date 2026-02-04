const errorUtil = {
    respostaErroService: (error) => {
        if (error?.name === 'ValidationError') {
            return {
                codigo: 400,
                mensagem: error.errors?.[0] || 'Erro de validação. Tente novamente.'
            };
        }

        return {
            codigo: 500,
            mensagem: 'Erro interno. Tente novamente.'
        };
    }
};

module.exports = errorUtil;