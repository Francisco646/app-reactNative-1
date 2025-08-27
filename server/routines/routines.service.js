const routinesRepository = require('./routines.repository');
const activitiesRepository = require('../activities/activities.repository');
const userRepository = require('../user/user.repository');
const historyRepository = require('../history/history.repository');

const jwt = require('jsonwebtoken');

class RoutinesService {

    constructor(routinesRepository, userRepository, activitiesRepository, historyRepository) {
        this.routinesRepository = routinesRepository;
        this.userRepository = userRepository;
        this.activitiesRepository = activitiesRepository;
        this.historyRepository = historyRepository;
    }

    /* Obtener el listado de rutinas de un plan específico */
    async getRoutines(token, planId){
        if(!token || token === 'undefined' || token === 'null') {
            return { statusCode: 401, message: 'No hay una sesión activa. Regresar a inicio.' };
        }

        try {
            const decodedToken = jwt.decode(token, 'supersecret');
            const emailFromToken = decodedToken.email;

            if(!emailFromToken){
                return { statusCode: 400, message: 'El email del token no es válido. Regresar a inicio.' };
            }

            const user = await userRepository.findUserByEmail(emailFromToken);
            if(!user) {
                return { statusCode: 404, message: 'No se ha encontrado el usuario con dicho email.' };
            }

            const planRoutines = await routinesRepository.findRoutinesByPlanId(planId);
            const routinesList = [];

            for(const routine of planRoutines) {
                const routineId = routine.id;
                const routineResult = await routinesRepository.findRoutineById(routineId);
                console.log('Routine Result:', routineResult)
                routinesList.push(routineResult);
            }

            return {statusCode: 200, message: routinesList};

        } catch (error) {
            console.error('Error obteniendo las rutinas:', error);
            return {statusCode: 500, message: error};
        }

    }

    async getRoutineById(token, id) {
        if(!token || token === 'undefined' || token === 'null') {
            return { statusCode: 401, message: 'No hay una sesión activa. Regresar a inicio.' };
        }

        try {
            const decodedToken = jwt.decode(token, 'supersecret');
            const emailFromToken = decodedToken.email;

            if(!emailFromToken){
                return { statusCode: 400, message: 'El email del token no es válido. Regresar a inicio.' };
            }

            const user = await userRepository.findUserByEmail(emailFromToken);
            if(!user) {
                return { statusCode: 404, message: 'No se ha encontrado el usuario con dicho email.' };
            }

            const routine = await routinesRepository.findRoutineById(id);
            if(!routine) {
                return { statusCode: 404, message: 'No se ha encontrado la rutina.' };
            }

            return { statusCode: 200, message: routine };

        } catch (error) {
            console.error('Error obteniendo la rutina:', error);
            return { statusCode: 500, message: error };
        }
    }

    async startRoutine(token, routineId){
        if(!token || token === 'undefined' || token === 'null') {
            return { statusCode: 401, message: 'No hay una sesión activa. Regresar a inicio.' };
        }

        try {
            const decodedToken = jwt.decode(token, 'supersecret');
            const emailFromToken = decodedToken.email;

            if(!emailFromToken){
                return { statusCode: 400, message: 'El email del token no es válido. Regresar a inicio.' };
            }

            const user = await userRepository.findUserByEmail(emailFromToken);
            if(!user) {
                return { statusCode: 404, message: 'No se ha encontrado el usuario con dicho email.' };
            }

            // Comprobar si el usuario ha realizado alguna rutina en la fecha actual
            const completedRoutinesOfUser = await routinesRepository.findAllCompletedRoutines(user.id);
            const currentDate = new Date();

            const currentDateDay = currentDate.getDate();
            const currentDateMonth = currentDate.getMonth();
            const currentDateYear = currentDate.getFullYear();

            for(const routine of completedRoutinesOfUser){
                const routineDate = routine.fecha_inicio;

                if(currentDateDay === routineDate.getDate() && currentDateMonth === routineDate.getMonth() && currentDateYear === routineDate.getFullYear()) {
                    return { statusCode: 400, message: 'Ya has realizado una rutina en el día de hoy.' };
                }
            }

            // Obtener las actividades de la rutina,
            const activitiesIdsOfRoutine = await activitiesRepository.findActivitiesOfRoutine(routineId)
            const routineToDo = await routinesRepository.startRoutine(user.id, routineId);

            let activitiesOfRoutine = [];

            // Insertar las actividades
            for(const activity of activitiesIdsOfRoutine){
                const obtainedActivity = await activitiesRepository.findActivityById(activity.id_actividad);
                const addedActivityToDo = await activitiesRepository.addActivityOfUserRoutine(routineToDo.insertId, obtainedActivity.id);
                activitiesOfRoutine.push(addedActivityToDo);
            }

            return {
                statusCode: 201,
                message: {
                    activitiesOfRoutine: activitiesOfRoutine,
                    routineToDo: routineToDo
                }
            };

        } catch(error){
            console.error('Error iniciando la rutina:', error);
            return { statusCode: 500, message: error };
        }
    }

    async endRoutine(token, usuarios_rutinas_id, porcentaje_completado, plataforma, modelo_dispositivo){
        if(!token || token === 'undefined' || token === 'null') {
            return { statusCode: 401, message: 'No hay una sesión activa. Regresar a inicio.' };
        }

        try {

            const decodedToken = jwt.decode(token, 'supersecret');
            const emailFromToken = decodedToken.email;

            if(!emailFromToken){
                return { statusCode: 400, message: 'El email del token no es válido. Regresar a inicio.' };
            }

            const user = await userRepository.findUserByEmail(emailFromToken);
            if(!user) {
                return { statusCode: 404, message: 'No se ha encontrado el usuario con dicho email.' };
            }

            // Finalizar rutina
            await routinesRepository.endRoutine(usuarios_rutinas_id, porcentaje_completado);

            // Crear registro en el historial
            await historyRepository.insertHistoryRecord(
                user.id,
                'Rutina',
                new Date(),
                'Rutina finalizada',
                plataforma,
                modelo_dispositivo
            )
            console.log('Registro de rutina en el historial creado con éxito')

            return { statusCode: 204 };

        } catch (error) {
            console.error('Error finalizando la rutina:', error);
            return { statusCode: 500, message: error };
        }
    }

    async getCurrentRoutine(token, id) {
        if(!token || token === 'undefined' || token === 'null') {
            return { statusCode: 401, message: 'No hay una sesión activa. Regresar a inicio.' };
        }

        try {
            const decodedToken = jwt.decode(token, 'supersecret');
            const emailFromToken = decodedToken.email;

            if(!emailFromToken){
                return { statusCode: 400, message: 'El email del token no es válido. Regresar a inicio.' };
            }

            const user = await userRepository.findUserByEmail(emailFromToken);
            if(!user) {
                return { statusCode: 404, message: 'No se ha encontrado el usuario con dicho email.' };
            }

            const currentRoutine = await routinesRepository.findCurrentRoutineById(id);
            if(!currentRoutine) {
                return { statusCode: 404, message: 'No se ha encontrado la rutina en curso.' };
            }

            return { statusCode: 200, message: currentRoutine };

        } catch(error) {
            console.error('Error obteniendo la rutina en curso:', error);
            return { statusCode: 500, message: error };
        }
    }

    async getNumberOfCompletedRoutines(token){
        if(!token || token === 'undefined' || token === 'null') {
            return { statusCode: 401, message: 'No hay una sesión activa. Regresar a inicio.' };
        }

        try {
            const decodedToken = jwt.decode(token, 'supersecret');
            const emailFromToken = decodedToken.email;

            if(!emailFromToken){
                return { statusCode: 400, message: 'El email del token no es válido. Regresar a inicio.' };
            }

            const user = await userRepository.findUserByEmail(emailFromToken);
            if(!user) {
                return { statusCode: 404, message: 'No se ha encontrado el usuario con dicho email.' };
            }

            const numberOfCompletedRoutines = await routinesRepository.findNumberOfCompletedRoutines(user.id);
            return { statusCode: 200, message: numberOfCompletedRoutines };

        } catch (error) {
            console.error('Error obteniendo el número de rutinas completadas:', error);
            return { statusCode: 500, message: error };
        }
    }

    async getRoutinesOfDate(token, date) {
        if(!token || token === 'undefined' || token === 'null') {
            return { statusCode: 401, message: 'No hay una sesión activa. Regresar a inicio.' };
        }

        try {
            const decodedToken = jwt.decode(token, 'supersecret');
            const emailFromToken = decodedToken.email;

            if(!emailFromToken){
                return { statusCode: 400, message: 'El email del token no es válido. Regresar a inicio.' };
            }

            const user = await userRepository.findUserByEmail(emailFromToken);
            if(!user) {
                return { statusCode: 404, message: 'No se ha encontrado el usuario con dicho email.' };
            }

            const routinesOfDate = await routinesRepository.findRoutinesInCalendarByUserIdAndDate(user.id, date);
            return { statusCode: 200, message: routinesOfDate };

        } catch (error) {
            console.error('Error obteniendo las rutinas del calendario:', error);
            return { statusCode: 500, message: error };
        }
    }

}

const routinesService = new RoutinesService(routinesRepository, userRepository, activitiesRepository, historyRepository);
module.exports = routinesService;
