const db = require('../db'); 

async function getUserHistory(usuario_id){
    const query = 'SELECT * FROM historial WHERE usuario_id = ?';
    const values = [usuario_id];

    const result = await db.query(query, values);
    return result;
}

async function insertHistoryRecord(usuario_id, accion, timestamp, descripcion, plataforma, modelo_dispositivo) {
    const query = 'INSERT INTO historial (usuario_id, accion, timestamp, descripcion, plataforma, modelo_dispositivo) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [usuario_id, accion, timestamp, descripcion, plataforma, modelo_dispositivo];

    const result = await db.query(query, values);
    return result;
}

module.exports = {
    getUserHistory,
    insertHistoryRecord
}