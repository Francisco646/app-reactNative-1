const planRepository = require('./plans.repository');
const routinesRepository = require('../routines/routines.repository');
const userRepository = require('../user/user.repository');

const jwt = require('jsonwebtoken');

class PlansService {

    constructor(planRepository, userRepository, routinesRepository) {
        this.planRepository = planRepository;
        this.userRepository = userRepository;
        this.routinesRepository = routinesRepository;
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

    async insertInUserCalendar(numWeeks, routinesOfPlan, userId) {

        let today = new Date();
        let routinesDates = [];

        for(let i = 0; i < numWeeks; i++){
            let baseDate = new Date(today)
            baseDate.setDate(baseDate.getDate() + i * 7);

            switch(routinesOfPlan.length) {
                case 1:
                    const nextMonday_1 = this.getNextWeekday(baseDate, 1);
                    await routinesRepository.insertRoutineInCalendar(userId, routinesOfPlan[0].id, nextMonday_1);

                    routinesDates.push(nextMonday_1);
                    break;

                case 2:
                    const nextMonday_2 = this.getNextWeekday(baseDate, 1);
                    const nextThursday = this.getNextWeekday(baseDate, 4);

                    await routinesRepository.insertRoutineInCalendar(userId, routinesOfPlan[0].id, nextMonday_2);
                    await routinesRepository.insertRoutineInCalendar(userId, routinesOfPlan[1].id, nextThursday);

                    routinesDates.push(nextMonday_2, nextThursday);
                    break;

                case 3:
                    const nextMonday_3 = this.getNextWeekday(baseDate, 1);
                    const nextWednesday = this.getNextWeekday(baseDate, 3);
                    const nextFriday = this.getNextWeekday(baseDate, 5);

                    await routinesRepository.insertRoutineInCalendar(userId, routinesOfPlan[0].id, nextMonday_3);
                    await routinesRepository.insertRoutineInCalendar(userId, routinesOfPlan[1].id, nextWednesday);
                    await routinesRepository.insertRoutineInCalendar(userId, routinesOfPlan[2].id, nextFriday);

                    routinesDates.push(nextMonday_3, nextWednesday, nextFriday);
                    break;

                default:
                    // Code
            }

        }

        return routinesDates;
    }

    /* Obtiene la fecha del próximo día de la semana especificado */
    getNextWeekday(date, weekday) {
        const resultDate = new Date(date);
        const daysToAdd = (7 + weekday - resultDate.getDay()) % 7;
        resultDate.setDate(resultDate.getDate() + daysToAdd);
        return resultDate;
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

    async getPlansByAgeRange(edad_minima, edad_maxima){
        try {
            const ageRangePlans = await planRepository.findPlansByAgeRange(edad_minima, edad_maxima)
            return { statusCode: 200, message: ageRangePlans }
        } catch (error) {
            console.error('Error obteniendo los planes:', error);
            return { statusCode: 500, message: error };
        }
    }

    async getPlansByDiseaseAndAge(tipo_enfermedad, edad_minima, edad_maxima) {
        try {
            const diseaseAndAgePlans = await planRepository.findPlansByDiseaseAndAge(tipo_enfermedad, edad_minima, edad_maxima)
            return { statusCode: 200, message: diseaseAndAgePlans }
        } catch (error) {
            console.error('Error obteniendo los planes:', error);
            return { statusCode: 500, message: error };
        }
    }

    async getPlansOfUser(token){
        if (!token || token === 'null' || token === 'undefined') {
            return { statusCode: 401, message: "Sin sesión activa. No se obtendrán los planes de usuario." };
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

            if(!planOfUser){
                return { statusCode: 404, message: 'No se ha encontrado un plan para el usuario.' };
            }

            console.log('Plan of user:', planOfUser);
            const planGeneralData = await planRepository.findPlanById(planOfUser.plan_id);

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

            // Crear plan al usuario y obtener el id del plan
            const createdUserPlan = await planRepository.createUserPlan(userId, plan_id);
            const basePlan = await planRepository.findPlanById(plan_id);

            // Insertar en el calendario
            const routinesOfPlan = await routinesRepository.findRoutinesByPlanId(plan_id);
            const numWeeks = basePlan.num_semanas;
            const dates = this.insertInUserCalendar(numWeeks, routinesOfPlan, userId);

            for (const date of dates) {
                await routinesRepository.insertRoutineInCalendar(userId, date);
            }

            return { statusCode: 201, message: createdUserPlan };

        } catch (error) {
            console.error('Error creando un plan para el usuario:', error);
            return { statusCode: 500, message: error };
        }
    }

    async deleteUserPlan(token) {
        try {
            const result = await this.manageToken(token);
            if (result.error) return { statusCode: result.code, message: result.message };
            const userId = result.userId;

            const userPlans = await planRepository.findPlansOfUser(userId);
            if(!userPlans){
                return { statusCode: 404, message: 'El usuario no tiene un plan asignado.' };
            }

            await routinesRepository.deleteUserRoutinesFromCalendar(userId);
            await planRepository.deleteUserPlan(userPlans.id);
            return { statusCode: 204 };

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

const plansService = new PlansService(planRepository, userRepository, routinesRepository);
module.exports = plansService;
