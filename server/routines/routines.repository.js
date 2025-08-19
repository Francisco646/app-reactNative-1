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
    return result;
}

/* Iniciar una rutina: Crear un registro de rutina realizada por el usuario */
const startRoutine = async(usuario_id, rutina_id) => {
    const query = 'INSERT INTO usuarios_rutinas (usuario_id, rutina_id, fecha_inicio, porcentaje_completado) VALUES (?, ?, ?, ?)';
    const values = [usuario_id, rutina_id, new Date(), 0];

    const result = await db.query(query, values);
    return result[0];
}

/* Actualizar el porcentaje completado y la fecha de finalización */
const endRoutine = async(id, porcentaje_completado) => {
    const query = 'UPDATE usuarios_rutinas SET fecha_fin = ?, porcentaje_completado = ? WHERE id = ?';
    const values = [new Date(), porcentaje_completado, id];

    const result = await db.query(query, values);
    return result[0];
}

/* Obtener el número de rutinas que ha completado un usuario */
const findNumberOfCompletedRoutines = async(usuario_id) => {
    const query = 'SELECT COUNT(*) AS total_completed_routines FROM usuarios_rutinas WHERE usuario_id = ?';
    const values = [usuario_id];

    const result = await db.query(query, values);
    return result;
}

/* Obtener las rutinas completadas */
const findCompletedRoutines = async(usuario_id) => {
    const query = 'SELECT * FROM usuarios_rutinas WHERE usuario_id = ?';
    const values = [usuario_id];

    const result = await db.query(query, values);
    return result[0]; // Basta con el primero, en este caso
}

/* Insertar rutina en el calendario */
const insertRoutineInCalendar = async(usuario_id, rutina_id, fecha, estado = 'pendiente') => {
    const query = 'INSERT INTO rutinas_calendario (usuario_id, rutina_id, fecha, estado) VALUES (?, ?, ?, ?)';
    const values = [usuario_id, rutina_id, fecha, estado];

    const result = await db.query(query, values);
    return result[0];
}

/* Eliminar rutina del calendario */
const deleteUserRoutinesFromCalendar = async(usuario_id) => {
    const query = 'DELETE FROM rutinas_calendario WHERE usuario_id = ?';
    const values = [usuario_id];

    const result = await db.query(query, values);
    return result[0];
}

/* Obtener las rutinas del calendario correspondientes a un usuario por fecha */
const findRoutinesInCalendarByUserIdAndDate = async(usuario_id, fecha) => {
    const query = 'SELECT * FROM rutinas_calendario WHERE usuario_id = ? AND fecha = ?';
    const values = [usuario_id, fecha];

    const result = await db.query(query, values);
    return result;
}

module.exports = {
    findRoutineById,
    findRoutinesByPlanId,

    startRoutine,
    endRoutine,
    findNumberOfCompletedRoutines,
    findCompletedRoutines,

    insertRoutineInCalendar,
    deleteUserRoutinesFromCalendar,
    findRoutinesInCalendarByUserIdAndDate
};
