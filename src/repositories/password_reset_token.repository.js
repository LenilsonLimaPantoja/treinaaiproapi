const executeQuery = require("../config/pgsql");

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