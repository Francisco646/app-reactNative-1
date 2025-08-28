const parameterRepository = require('./parameter.repository');
const activitiesRepository = require('../activities/activities.repository');

class ParameterService {

    constructor(parameterRepository, activitiesRepository) {
        this.parameterRepository = parameterRepository;
        this.activitiesRepository = activitiesRepository;
    }

    async getParametersOfUserActivity(token, id, parametros_ids) {
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

            const userActivity = await activitiesRepository.findActivityOfUserRoutine(id);
            if(!userActivity) {
                return { statusCode: 404, message: 'No se ha encontrado la actividad del usuario.' };
            }

            const parameters = [];
            for(const id of parametros_ids) {
                const parameter = await parameterRepository.findParameterById(id);
                if(parameter) {
                    const measures = await parameterRepository.findParametersMeasuresByUserActivityId(userActivity.id, id);
                    parameters.push({
                        parametro: parameter,
                        medidas: measures
                    });
                } else {
                    parameters.push({
                        parametro: { id: id, nombre: 'Parámetro no encontrado', unidad: '' },
                        medidas: []
                    });
                }
            }

            return { statusCode: 200, data: parameters };
        } catch(error) {
            console.error('Error obteniendo los parámetros:', error);
            return { statusCode: 500, message: error };
        }
    }

}

const parameterService = new ParameterService(parameterRepository, activitiesRepository);
module.exports = parameterService;