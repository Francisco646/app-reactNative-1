const db = require('../db');

const findActivityById = async(id) => {
    const query = 'SELECT * FROM actividades WHERE id = ?';
    const values = [id];

    const result = await db.query(query, values);
    return result[0];
}

/* Obtener las actividades correspondientes a una rutina */
const findActivitiesOfRoutine = async(id_rutina) => {
    const query = 'SELECT * FROM rutinas_actividades WHERE id_rutina = ?';
    const values = [id_rutina];

    const result = await db.query(query, values);
    return result[0];
}

module.exports = {
    findActivityById,
    findActivitiesOfRoutine
}
