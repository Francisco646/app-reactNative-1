const db = require('../db');

async function findRewardById(id) {
    const query = 'SELECT * FROM logros WHERE id = ?';
    const values = [id];

    const result = await db.query(query, values);
    return result;
}

async function findSpecificRewardById(id) {
    const query = 'SELECT * FROM logros_especificos WHERE logro_id = ?';
    const values = [id];

    const result = await db.query(query, values);
    return result;
}

async function findSpecificRewardsByDisease(tipo_enfermedad) {
    const query = 'SELECT * FROM logros_especificos WHERE tipo_enfermedad = ?';
    const values = [tipo_enfermedad];

    const result = await db.query(query, values);

    console.log("**Enfermedades Específicas**");
    console.log('Tipo de result:', typeof result);
    console.log('Es array?:', Array.isArray(result));
    console.log('Contenido:', result);
    console.log('Longitud:', result.length);

    return result;
}

async function findAllGeneralRewards() {
    const query = 'SELECT * FROM logros_generales';
    const result = await db.query(query);

    console.log("**Enfermedades Generales**");
    console.log('Tipo de result:', typeof result);
    console.log('Es array?:', Array.isArray(result));
    console.log('Contenido:', result);
    console.log('Longitud:', result.length);

    return result;
}

async function createUserReward(usuario_id, logro_id, tipo_logro) {
    const query = 'INSERT INTO logros_usuario (usuario_id, logro_id, completado, progreso, tipo_logro) VALUES (?, ?, ?, ?, ?)';
    const values = [usuario_id, logro_id, 0, 0, tipo_logro];

    const result = await db.query(query, values);
    return result;
}

async function findGeneralUserRewards(usuario_id) {
    const query = 'SELECT * FROM logros_usuario WHERE usuario_id = ? AND tipo_logro = ?';
    const values = [usuario_id, "general"];

    const result = await db.query(query, values);
    return result;
}

async function findSpecificUserRewards(usuario_id) {
    const query = 'SELECT * FROM logros_usuario WHERE usuario_id = ? AND tipo_logro = ?';
    const values = [usuario_id, "especifico"];

    const result = await db.query(query, values);
    return result;
}

async function findUserRewardById(usuario_id, logro_id) {
    const query = 'SELECT * FROM logros_usuario WHERE usuario_id = ? AND logro_id = ?';
    const values = [usuario_id, logro_id];

    const result = await db.query(query, values);
    return result;
}

async function findNumberOfCompletedGenSpecRewards(usuario_id, tipo_logro) {
    const query = 'SELECT COUNT(*) AS total_completed FROM logros_usuario WHERE usuario_id = ? AND completado = ? AND tipo_logro = ?';
    const values = [usuario_id, 1, tipo_logro];

    const result = await db.query(query, values);
    return result;
}

async function findNumberOfUncompletedGenSpecRewards(usuario_id, tipo_logro) {
    const query = 'SELECT COUNT(*) AS total_uncompleted FROM logros_usuario WHERE usuario_id = ? AND completado = ? AND tipo_logro = ?';
    const values = [usuario_id, 0, tipo_logro];

    const result = await db.query(query, values);
    return result;
}

async function findNumberOfGenSpecRewards(usuario_id, tipo_logro) {
    const query = 'SELECT COUNT(*) AS total FROM logros_usuario WHERE usuario_id = ? AND tipo_logro = ?';
    const values = [usuario_id, tipo_logro];

    const result = await db.query(query, values);
    return result;
}

/* Número de logros específicos */

module.exports = {
    findRewardById,
    findSpecificRewardById,
    findSpecificRewardsByDisease,
    findAllGeneralRewards,
    createUserReward,
    findGeneralUserRewards,
    findSpecificUserRewards,
    findUserRewardById,
    findNumberOfCompletedGenSpecRewards,
    findNumberOfUncompletedGenSpecRewards,
    findNumberOfGenSpecRewards
};
