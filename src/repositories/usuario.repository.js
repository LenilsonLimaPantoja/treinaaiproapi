const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const executeQuery = require("../config/pgsql");

exports.save = async (data) => {
    const columns = Object.keys(data).filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at');

    const placeholders = columns.map((__, i) => `$${i + 1}`).join(', ');

    const params = columns.map(col => data[col]);

    const sql = `INSERT INTO usuarios (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`;

    const result = await executeQuery(sql, params);
    return result[0]?.id;

}

exports.updateMe = async (data) => {
    const columns = Object.keys(data).filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key !== 'senha');

    const params = columns.map(col => data[col]);
    params.push(data.id);

    const sql = `UPDATE usuarios set ${columns.map((col, i) => `${col}=$${i + 1}`).join(', ')}
                        WHERE id=$${columns.length + 1}  RETURNING id`;

    const result = await executeQuery(sql, params);
    return result[0]?.id;
}

exports.readAll = async (filtro) => {
    let params = [];
    let sql = 'SELECT id, nome, email, nascimento, created_at, updated_at FROM usuarios';

    if (filtro) {
        sql += ' WHERE nome LIKE $1 OR email LIKE $2';
        params.push(`%${filtro}%`, `%${filtro}%`);
    }
    const result = await executeQuery(sql, params);
    return result || [];
}

exports.me = async (id) => {
    let sql = 'SELECT id, nome, email, nascimento, created_at, updated_at FROM usuarios WHERE id = $1';

    const result = await executeQuery(sql, [id]);
    return result || [];
}

exports.readOneSaveMe = async (email) => {
    let sql = 'SELECT * FROM usuarios WHERE email = $1';

    const result = await executeQuery(sql, [email]);
    return result || [];
}

exports.readOneUpdateMe = async (email, id) => {
    let sql = 'SELECT * FROM usuarios WHERE email = $1 AND id != $2';

    const result = await executeQuery(sql, [email, id]);
    return result || [];
}

exports.deleteMe = async (id) => {
    let sql = 'DELETE FROM usuarios WHERE id = $1';

    await executeQuery(sql, [id]);
    return id;
}

exports.login = async (usuario, senha) => {
    const senhaValida = await bcrypt.compare(senha, usuario[0]?.senha);
    if (senhaValida) {
        const token = jwt.sign(
            {
                id: usuario[0]?.id,
                nome: usuario[0]?.nome,
                email: usuario[0]?.email,
                created_at: usuario[0]?.created_at,
                updated_at: usuario[0].updated_at
            },
            process.env.JWT_KEY,
            {
                expiresIn: '48h'
            }
        );

        let dados = [
            {
                id: usuario[0].id,
                nome: usuario[0].nome,
                email: usuario[0].email,
                nascimento: usuario[0].nascimento,
                created_at: usuario[0].created_at,
                updated_at: usuario[0].updated_at,
                token: token
            }
        ];

        return { codigo: 200, dados: dados }
    } else {
        return { codigo: 401 };
    }
}