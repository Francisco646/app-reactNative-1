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
    return result;
}

/* Actualizar el porcentaje completado y la fecha de finalización */
const endRoutine = async(id, porcentaje_completado) => {
    const query = 'UPDATE usuarios_rutinas SET fecha_fin = ?, porcentaje_completado = ? WHERE id = ?';
    const values = [new Date(), porcentaje_completado, id];

    const result = await db.query(query, values);
    return result[0];
}

/* Obtener la rutina en curso por su id */
const findCurrentRoutineById = async(id) => {
    const query = 'SELECT * FROM usuarios_rutinas WHERE id = ?';
    const values = [id];

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

/* Obtener todas las rutinas que ha completado el usuario */
const findAllCompletedRoutines = async(usuario_id) => {
    const query = 'SELECT * FROM usuarios_rutinas WHERE usuario_id = ?';
    const values = [usuario_id];

    const result = await db.query(query, values);
    return result;
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

/* Crear un registro en la tabla de wellness_tests */
const createWellnessTest = async (usuario_id, dolor, sueño, fatiga, animo, test_inicial) => {
    const query = 'INSERT INTO wellness_tests (usuario_id, dolor, sueño, fatiga, animo, fecha, test_inicial) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [usuario_id, dolor, sueño, fatiga, animo, new Date(), test_inicial];

    const result = await db.query(query, values);
    return result;
};

/* Obtener un registro de la tabla wellness_tests */
const findWellnessTestById = async (id) => {
    const query = 'SELECT * FROM wellness_tests WHERE id = ?';
    const values = [id];

    const result = await db.query(query, values);
    return result[0];
};

/* Insertar el id de test de bienestar inicial */
const insertInitialWellnessTestId = async (usuarios_rutinas_id, wellness_test_id) => {
    const query = 'UPDATE usuarios_rutinas SET wellness_tests_initial_id = ? WHERE id = ?';
    const values = [wellness_test_id, usuarios_rutinas_id];

    const result = await db.query(query, values);
    return result;
}

/* Insertar el ide de test de bienestar final */
const insertFinalWellnessTestId = async (usuarios_rutinas_id, wellness_test_id) => {
    const query = 'UPDATE usuarios_rutinas SET wellness_tests_final_id = ? WHERE id = ?';
    const values = [wellness_test_id, usuarios_rutinas_id];

    const result = await db.query(query, values);
    return result;
}

/* Obtener un test de bienestar */
const getWellnessTestById = async (id) => {
    const query = 'SELECT * FROM wellness_tests WHERE id = ?';
    const values = [id];

    const result = await db.query(query, values);
    return result[0];
}


module.exports = {
    findRoutineById,
    findRoutinesByPlanId,

    startRoutine,
    endRoutine,
    findCurrentRoutineById,
    findNumberOfCompletedRoutines,
    findCompletedRoutines,
    findAllCompletedRoutines,

    insertRoutineInCalendar,
    deleteUserRoutinesFromCalendar,
    findRoutinesInCalendarByUserIdAndDate,

    createWellnessTest,
    findWellnessTestById,
    insertInitialWellnessTestId,
    insertFinalWellnessTestId
};
