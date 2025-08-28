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
    return result;
}

/* Añadir las actividades que deben realizarse durante una rutina */
const addActivityOfUserRoutine = async(usuario_rutina_id, actividad_id) => {
    const query = 'INSERT INTO usuarios_actividades (usuario_rutina_id, actividad_id) VALUES (?, ?)';
    const values = [usuario_rutina_id, actividad_id];

    const result = await db.query(query, values);
    return result[0];
}

/* Actualizar el estado de la actividad (marcar como completada, y cuándo sucedió) */
const updateActivityOfUserRoutine = async(usuario_rutina_id, actividad_id) => {
    const query = 'UPDATE usuarios_actividades SET completada = ?, fecha_completada = ? WHERE usuario_rutina_id = ? AND actividad_id = ?';
    const values = [1, new Date(), usuario_rutina_id, actividad_id];

    const result = await db.query(query, values);
    return result[0];
}

/* Obtener la actividad a realizar (llamar esta función cuando la actividad esté recién añadida, o si se quiere obtener el estatus) */
const findActivityOfUserRoutine = async(id) => {
    const query = 'SELECT * FROM usuarios_actividades WHERE id = ?';
    const values = [id];

    const result = await db.query(query, values);
    return result[0];
}

/* Obtener las actividades del usuario */
const findActivitiesByActivityId = async(actividad_id) => {
    const query = 'SELECT * FROM usuarios_actividades WHERE actividad_id = ?';
    const values = [actividad_id];

    const result = await db.query(query, values);
    return result;
}

/* Obtener número de actividades completadas por el usuario */
const findNumberOfUserCompletedActivities = async(usuario_rutina_id) => {
    const query = 'SELECT COUNT(*) AS total_completed_activities FROM usuarios_actividades WHERE usuario_rutina_id = ?'
    const values = [usuario_rutina_id];

    const result = await db.query(query, values);
    return result;
}

module.exports = {
    findActivityById,
    findActivitiesOfRoutine,

    addActivityOfUserRoutine,
    updateActivityOfUserRoutine,
    findActivityOfUserRoutine,
    findActivitiesByActivityId,
    findNumberOfUserCompletedActivities
}
