const planRepository = require('./plans.repository');
const userRepository = require('../user/user.repository');

const jwt = require('jsonwebtoken');

class PlansService {

    constructor(planRepository, userRepository) {
        this.planRepository = planRepository;
        this.userRepository = userRepository;
    }

    /* AUXILIAR */


    /* GENERALES */
    async getAllPlans(){

        try {
            const plans = await planRepository.findAllPlans()
            return { statusCode: 200, message: plans };

        } catch (error) {
            console.error('Error obteniendo los planes:', error);
            return { statusCode: 500, message: error };
        }
    }

    async getPlansOfDisease(tipo_enfermedad){
        try {
            const plans = await planRepository.findPlansByDiseaseType(tipo_enfermedad)
            return { statusCode: 200, message: plans }
        } catch (error) {
            console.error('Error obteniendo los planes:', error);
            return { statusCode: 500, message: error };
        }
    }

    async getPlansOfUser(token){
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

            const userId = user.id;
            const plansOfUser = await planRepository.findPlansOfUser(userId);
            const plans = [];

            for(const plan of plansOfUser) {
                const planId = plan.plan_id;
                const planResult = await planRepository.findPlanById(planId);
                plans.push(planResult);
            }

            return { statusCode: 200, message: plans };

        } catch(error) {
            console.error('Error obteniendo los planes:', error);
            return { statusCode: 500, message: error };
        }
    }

}

const plansService = new PlansService(planRepository, userRepository);
module.exports = plansService;
