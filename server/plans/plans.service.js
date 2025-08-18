const planRepository = require('./plans.repository');
const userRepository = require('../user/user.repository');

const jwt = require('jsonwebtoken');

class PlansService {

    constructor(planRepository, userRepository) {
        this.planRepository = planRepository;
        this.userRepository = userRepository;
    }

    /* AUXILIAR */
    async manageToken(token){
        if (!token || token === 'null' || token === 'undefined') {
            return { error: true, code: 401, message: "Sin sesión activa. No se obtendrán recompensas." };
        }

        try {
            const decodedToken = jwt.verify(token, 'supersecret');
            const email = decodedToken.email;

            if (!email) {
                return { error: true, code: 400, message: "No se ha podido obtener el email adecuadamente" };
            }

            const user = await userRepository.findUserByEmail(email);
            if (!user) {
                return { error: true, code: 404, message: "No se ha podido encontrar el usuario especificado" };
            }

            return { error: false, userId: user.id };
        } catch (err) {
            return { error: true, code: 500, message: err.message };
        }
    }


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
        if (!token || token === 'null' || token === 'undefined') {
            return { error: true, code: 401, message: "Sin sesión activa. No se obtendrán recompensas." };
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

            const userId = user.id;
            const planOfUser = await planRepository.findPlansOfUser(userId);
            const planGeneralData = await planRepository.findPlanById(planOfUser.id)

            return {
                statusCode: 200,
                message: {
                    planOfUser: planOfUser,
                    planGeneralData: planGeneralData
                }
            };

        } catch(error) {
            console.error('Error obteniendo los planes:', error);
            return { statusCode: 500, message: error };
        }
    }

    async createUserPlan(token, plan_id) {
        try {
            const result = await this.manageToken(token);
            if (result.error) return { statusCode: result.code, message: result.message };
            const userId = result.userId;

            const userPlans = await planRepository.findPlansOfUser(userId);
            if(userPlans) {
                return { statusCode: 400, message: 'El usuario ya tiene un plan asignado.' };
            }

            const createdUserPlan = await planRepository.createUserPlan(userId, plan_id);
            return { statusCode: 201, message: createdUserPlan };

        } catch (error) {
            console.error('Error creando un plan para el usuario:', error);
            return { statusCode: 500, message: error };
        }
    }

    async deleteUserPlan(token, plan_id) {
        try {
            const result = await this.manageToken(token);
            if (result.error) return { statusCode: result.code, message: result.message };
            const userId = result.userId;

            const userPlans = await planRepository.findPlansOfUser(userId);
            if(!userPlans){
                return { statusCode: 400, message: 'El usuario no tiene un plan asignado.' };
            }

            await planRepository.deleteUserPlan(userPlans.id);
            return { statusCode: 204, message: 'Plan eliminado con éxito.' };

        } catch (error) {
            console.error('Error eliminando un plan de usuario:', error);
            return { statusCode: 500, message: error };
        }
    }

    async updatePercentageCompletedUserPlan(token, id, porcentaje_completado) {
        try {
            const result = await this.manageToken(token);
            if (result.error) return { statusCode: result.code, message: result.message };
            const userId = result.userId;

            const userPlans = await planRepository.findPlansOfUser(userId);
            if(!userPlans){
                return { statusCode: 400, message: 'El usuario no tiene un plan asignado.' };
            }

            const updatedPlan = await planRepository.updatePercentageCompletedUserPlan(id, porcentaje_completado);
            return { statusCode: 200, message: updatedPlan };

        } catch (error) {
            console.error('Error actualizando el porcentaje de completado', error);
            return { statusCode: 500, message: error };
        }
    }

    async updateEndDateUserPlan(token, id){
        try {
            const result = await this.manageToken(token);
            if (result.error) return { statusCode: result.code, message: result.message };
            const userId = result.userId;

            const userPlans = await planRepository.findPlansOfUser(userId);
            if(!userPlans){
                return { statusCode: 400, message: 'El usuario no tiene un plan asignado.' };
            }

            const updatedPlan = await planRepository.updateEndDateUserPlan(id);
            return { statusCode: 200, message: updatedPlan };

        } catch (error) {
            console.error('Error actualizando la fecha de final de usuario', error)
            return { statusCode: 500, message: error };
        }
    }

}

const plansService = new PlansService(planRepository, userRepository);
module.exports = plansService;
