const mysql = require('mysql2/promise');

// Configura tu conexión (ajusta host, user, password, database)
const pool = mysql.createPool({
    host: 'mysql-3b4a204d-franciscosanchoval-9361.e.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_5SDeuAlKA7-7YZ_CwQB',
    database: 'defaultdb',
    port: 11667,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función para ejecutar queries
async function query(sql, params) {
    const [result] = await pool.execute(sql, params);
    return result;
}

module.exports = {
    query
};
