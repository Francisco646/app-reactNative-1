const db = require('../db');

const getMaterialById = async (id) => {
    const query = 'SELECT * FROM materiales WHERE id = ?';
    const values = [id];

    const result = await db.query(query, values);
    return result[0];
};

const getMaterialByActivityId = async(actividad_id) => {
    const query = 'SELECT * FROM actividad_materiales WHERE actividad_id = ?'
    const values = [actividad_id];

    const result = await db.query(query, values);
    return result[0];
}

module.exports = {
    getMaterialById,
    getMaterialByActivityId
};
