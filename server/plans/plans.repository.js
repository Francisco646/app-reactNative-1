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
    return result;
}

/* Obtener los planes correspondientes a un usuario */
const findPlansOfUser = async (usuario_id) => {
    const query = 'SELECT * FROM usuarios_planes WHERE usuario_id = ?';
    const values = [usuario_id];

    const result = await db.query(query, values);
    return result[0];
}

const createUserPlan = async (usuario_id, plan_id) => {
    const query = 'INSERT INTO usuarios_planes (fecha_inicio, porcentaje_completado, usuario_id, plan_id) VALUES (?, ?, ?, ?)';
    const values = [Date.now(), 0, usuario_id, plan_id];

    const result = await db.query(query, values);
    return result[0];
}

const deleteUserPlan = async (id) => {
    const query = 'DELETE FROM usuarios_planes WHERE id = ?';
    const values = [id];

    const result = await db.query(query, values);
    return result[0];
}

const updatePercentageCompletedUserPlan = async (id, porcentaje_completado) => {
    const query = 'UPDATE usuarios_planes SET porcentaje_completado = ? WHERE id = ?';
    const values = [porcentaje_completado, id];

    const result = await db.query(query, values);
    return result[0];
}

const updateEndDateUserPlan = async (id) => {
    const query = 'UPDATE usuarios_planes SET fecha fin = ? WHERE id = ?';
    const values = [Date.now(), id];

    const result = await db.query(query, values);
    return result[0];
}

module.exports = {
    findPlanById,
    findPlansByDiseaseType,
    findAllPlans,
    findPlansOfUser,
    createUserPlan,
    deleteUserPlan,
    updatePercentageCompletedUserPlan,
    updateEndDateUserPlan
}
