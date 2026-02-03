const jwt = require("jsonwebtoken");

exports.obrigatorioLogin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      retorno: {
        status: 401,
        mensagem: "Usuário não autorizado, faça login e tente novamente."
      },
      registros: []
    });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).send({
      retorno: {
        status: 401,
        mensagem: "Token inválido."
      },
      registros: []
    });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_KEY);
    return next();
  } catch (err) {
    return res.status(401).send({
      retorno: {
        status: 401,
        mensagem: "Token expirado ou inválido."
      },
      registros: []
    });
  }
};