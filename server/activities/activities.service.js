const userRepository = require('../user/user.repository');
const activitiesRepository = require('./activities.repository');

const jwt = require('jsonwebtoken')
const routinesRepository = require("../routines/routines.repository");

class ActivitiesService {

    constructor(userRepository, activitiesRepository, routinesRepository) {
        this.userRepository = userRepository;
        this.activitiesRepository = activitiesRepository;
        this.routinesRepository = routinesRepository;
    }

    /* FUNCIONES GENERALES */
    async getActivities(token, routineId){

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

            const routineActivities = await activitiesRepository.findActivitiesOfRoutine(routineId);
            const activitiesList = [];

            for(const activity of routineActivities) {
                const activityId = activity.id;
                const activityResult = await activitiesRepository.findActivityById(activityId);
                activitiesList.push(activityResult);
            }

            return { statusCode: 200, message: activitiesList };

        } catch (error) {
            console.error('Error obteniendo las actividades:', error)
            return { statusCode: 500, message: error };
        }

    }

    async setActivityAsCompleted(token, usuarios_actividades_id){
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

            // Marcar como completada
            const activityAsCompleted = await activitiesRepository.updateActivityOfUserRoutine(usuarios_actividades_id)
            return { statusCode: 200, message: `Actividad completada: ${activityAsCompleted}` };

        } catch (error) {
            console.error('Error actualizando el estado de la actividad:', error);
            return { statusCode: 500, message: error };
        }
    }

    async getNumberOfCompletedActivities(token){
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

            const completedRoutines = await routinesRepository.findCompletedRoutines(user.id)
            const numberOfCompletedActivities = await activitiesRepository.findNumberOfUserCompletedActivities(completedRoutines.id);

            return { statusCode: 200, message: numberOfCompletedActivities };

        } catch (error) {
            console.error('Error obteniendo el número de actividades completadas:', error);
            return { statusCode: 500, message: error };
        }
    }

}

const activitiesService = new ActivitiesService(userRepository, activitiesRepository, routinesRepository);
module.exports = activitiesService;
