const executeQuery = require("../config/pgsql");
const crypto = require("crypto");

exports.save = async (data) => {
    const columns = Object.keys(data).filter(key => key !== 'id' && key !== 'created_at' && key !== 'used_at');

    const placeholders = columns.map((__, i) => `$${i + 1}`).join(', ');

    const params = columns.map(col => data[col]);

    const sql = `INSERT INTO password_reset_tokens (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`;

    const result = await executeQuery(sql, params);
    return result[0]?.id;

}

exports.readTentativasResetSenha = async (user_id, request_ip) => {
    const sql = `
        SELECT
            (
                SELECT COUNT(*)
                FROM password_reset_tokens
                WHERE user_id = $1
                AND created_at >= NOW() - INTERVAL '15 minutes'
            ) AS tentativas_user,
            (
                SELECT COUNT(*)
                FROM password_reset_tokens
                WHERE request_ip = $2
                AND created_at >= NOW() - INTERVAL '15 minutes'
            ) AS tentativas_ip
    `;

    const [row] = await executeQuery(sql, [user_id, request_ip]);

    return {
        tentativas_user: Number(row?.tentativas_user ?? 0),
        tentativas_ip: Number(row?.tentativas_ip ?? 0),
    };
};

exports.verificaToken = async (token) => {
    const token_hash = crypto.createHash("sha256").update(token).digest("hex");

    const sql = `
    SELECT id, user_id, expires_at, used_at
    FROM password_reset_tokens
    WHERE token_hash = $1
    LIMIT 1
  `;

    const result = await executeQuery(sql, [token_hash]);

    return result || [];
};



exports.updateTokenResetSenha = async (id) => {
    const sql = 'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1';
    await executeQuery(sql, [id]);

    return id;
};
