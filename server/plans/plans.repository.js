const db = require('../db');

const findPlanById = async(id)=> {
    const query = 'SELECT * FROM planes WHERE id = ?';
    const values = [id];

    const result = await db.query(query, values);
    return result[0];
}

const findPlansByDiseaseType = async (tipo_enfermedad) => {
    const query = 'SELECT * FROM planes WHERE tipo_enfermedad = ?';
    const values = [tipo_enfermedad];

    const result = await db.query(query, values);
    return result[0];
}

const findAllPlans = async () => {
    const query = 'SELECT * FROM planes';
    const result = await db.query(query);
    return result[0];
}

/* Obtener los planes correspondientes a un usuario */
const findPlansOfUser = async (usuario_id) => {
    const query = 'SELECT * FROM usuarios_planes WHERE usuario_id = ?';
    const values = [usuario_id];

    const result = await db.query(query, values);
    return result[0];
}

module.exports = {
    findPlanById,
    findPlansByDiseaseType,
    findAllPlans,
    findPlansOfUser
}
