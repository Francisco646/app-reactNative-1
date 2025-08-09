const db = require('../db');

const findRoutineById = async(id) => {
    const query = 'SELECT * FROM rutinas WHERE id = ?';
    const values = [id];

    const result = await db.query(query, values);
    return result[0];
}

/* Obtener las rutinas correspondientes a un plan */
const findRoutinesByPlanId = async(id_plan) => {
    const query = 'SELECT * FROM rutinas WHERE id_plan = ?';
    const values = [id_plan];

    const result = await db.query(query, values);
    return result[0];
}

module.exports = {
    findRoutineById,
    findRoutinesByPlanId
}
