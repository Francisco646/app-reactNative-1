const routinesRepository = require('./routines.repository');
const userRepository = require('../user/user.repository');

const jwt = require('jsonwebtoken');

class RoutinesService {

    constructor(routinesRepository, userRepository) {
        this.routinesRepository = routinesRepository;
        this.userRepository = userRepository;
    }

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
                routinesList.push(routineResult);
            }

            return {statusCode: 200, message: routinesList};

        } catch (error) {
            console.error('Error obteniendo las rutinas:', error);
            return {statusCode: 500, message: error};
        }
        
    }

}

const routinesService = new RoutinesService(routinesRepository, userRepository);
module.exports = routinesService;
