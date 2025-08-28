const db = require('../db');

const findParameterById = async(id) => {
    const query = 'SELECT * FROM parametros WHERE id = ?';
    const values = [id];

    const result = await db.query(query, values);
    return result[0];
};

const findParametersMeasuresByUserActivityId = async (usuario_actividad_id, parametro_id) => {
    const query = 'SELECT * FROM medidas WHERE usuario_actividad_id = ? AND parametro_id = ?';
    const values = [usuario_actividad_id, parametro_id];

    const result = await db.query(query, values);
    return result;
};

const insertParameterMeasure = async (usuario_actividad_id, parametro_id, valor) => {
    const query = 'INSERT INTO medidas (usuario_actividad_id, parametro_id, valor, fecha_medida) VALUES (?, ?, ?, ?)';
    const values = [usuario_actividad_id, parametro_id, valor, new Date()];

    const result = await db.query(query, values);
    return result.insertId;
};

module.exports = {
    findParameterById,
    findParametersMeasuresByUserActivityId,
    insertParameterMeasure
};
