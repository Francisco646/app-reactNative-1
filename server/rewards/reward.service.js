const rewardsRepository = require('./reward.repository')
const userRepository = require('../user/user.repository')

const jwt = require('jsonwebtoken');

class RewardsService {

    constructor(rewardsRepository, userRepository) {
        this.rewardsRepository = rewardsRepository;
        this.userRepository = userRepository;
    }

    /* FUNCIONES AUXILIARES */

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

    /* FUNCIONES GENERALES */

    // Obtener un logro específico
    async getRewardById(id){
        if(!id || typeof (id) !== 'bigint'){
            return { statusCode: 400, message: "Uno o varios de los IDs no se han introducido adecuadamente" };
        }

        const reward = await rewardsRepository.findRewardById(id);
        if(!reward){
            return { statusCode: 404, message: "No se ha encontrado el logro solicitado" };
        }

        return { statusCode: 200, message: reward };
    }

    // Obtener todos los logros relativos a una enfermedad en concreto
    async getSpecificRewardsByDisease(tipo_enfermedad){
        if(!tipo_enfermedad || typeof (tipo_enfermedad) !== "string"){
            return { statusCode: 400, message: "El tipo de enfermedad no se ha introducido adecuadamente" };
        }

        const specificRewards = await rewardsRepository.findSpecificRewardsByDisease(tipo_enfermedad);
        if(!specificRewards){
            return { statusCode: 404, message: "No se han encontrado logros para la enfermedad introducida" };
        }

        return { statusCode: 200, message: specificRewards };
    }

    // Obtener los logros comunes a todos los usuarios
    async getAllGeneralRewards(){
        const generalRewards = await rewardsRepository.findAllGeneralRewards();
        if(!generalRewards){
            return { statusCode: 404, message: "No se han encontrado logros generales" };
        }

        return { statusCode: 200, message: generalRewards };
    }

    // Insertar un logro a un usuario en el sistema
    async createUserReward(usuario_id, logro_id, tipo_logro){
        if(!usuario_id){
            return { statusCode: 400, message: "No se ha insertado el ID de usuario adecuadamente" };
        }

        if(!logro_id){
            return { statusCode: 400, message: "No se ha introducido adecuadamente el ID del logro" }
        }

        const createdReward = await rewardsRepository.createUserReward(usuario_id, logro_id, tipo_logro);
        return { statusCode: 201, message: createdReward }
    }

    // Obtener los datos sobre los logros generales de un usuario
    async getUserGeneralRewards(token){
        try {
            const result = await this.manageToken(token);
            if (result.error) return { statusCode: result.code, message: result.message };
            const userId = result.userId;

            // Obtener ID de las recompensas del usuario
            const userGeneralRewards = await rewardsRepository.findGeneralUserRewards(userId);

            // Obtener recompensas
            const rewards = [];
            for(let reward of userGeneralRewards){
                const reward_id = reward.logro_id;
                const reward_data = await rewardsRepository.findRewardById(reward_id);
                rewards.push(reward_data);
            }

            return {
                statusCode: 200,
                message: {
                    userRewardData: userGeneralRewards,
                    commonData: rewards
                }
            }

        } catch(error) {
            console.error("Error obteniendo los logros del usuario:", error)
            return { statusCode: 500, message: error }
        }
    }

    // Obtener los datos sobre los logros específicos de un usuario
    async getUserSpecificRewards(token){
        try {
            const result = await this.manageToken(token);
            if (result.error) return { statusCode: result.code, message: result.message };
            const userId = result.userId;

            console.log('Token received:', token);
            console.log('Result from manageToken:', result);
            console.log('User ID:', result.userId);

            // Obtener ID de las recompensas del usuario
            const userSpecificRewards = await rewardsRepository.findSpecificUserRewards(userId);

            // Obtener datos de las recompensas del usuario
            const rewards = [];
            for(let reward of userSpecificRewards){
                const reward_id = reward.logro_id;
                const reward_data = await rewardsRepository.findRewardById(reward_id);
                rewards.push(reward_data);
            }

            // Estructurar los datos
            return {
                statusCode: 200,
                message: {
                    userRewardData: userSpecificRewards,
                    commonData: rewards,
                }
            }


        } catch(error) {
            console.error("Error obteniendo los logros del usuario:", error)
            return { statusCode: 500, message: error }
        }
    }

    // Obtener estadísticas de recompensas de un usuario
    async getUserRewardsStats(token){
        try {
            const result = await this.manageToken(token);
            if (result.error) return { statusCode: result.code, message: result.message };
            const userId = result.userId;

            // Logros generales
            const numOfCompletedGeneralRewards = await rewardsRepository.findNumberOfCompletedGenSpecRewards(userId, 'general');
            const numOfUncompletedGeneralRewards = await rewardsRepository.findNumberOfUncompletedGenSpecRewards(userId, 'general');
            const numOfTotalGeneralRewards = await rewardsRepository.findNumberOfGenSpecRewards(userId, 'general');

            // Logros especificos
            const numOfCompletedSpecificRewards = await rewardsRepository.findNumberOfCompletedGenSpecRewards(userId, 'especifico');
            const numOfUncompletedSpecificRewards = await rewardsRepository.findNumberOfUncompletedGenSpecRewards(userId, 'especifico');
            const numOfTotalSpecificRewards = await rewardsRepository.findNumberOfGenSpecRewards(userId, 'especifico');

            return {
                statusCode: 200,
                message: {
                    numOfCompletedGeneralRewards: numOfCompletedGeneralRewards,
                    numOfUncompletedGeneralRewards: numOfUncompletedGeneralRewards,
                    numOfTotalGeneralRewards: numOfTotalGeneralRewards,

                    numOfCompletedSpecificRewards: numOfCompletedSpecificRewards,
                    numOfUncompletedSpecificRewards: numOfUncompletedSpecificRewards,
                    numOfTotalSpecificRewards: numOfTotalSpecificRewards
                }
            }

        } catch(error) {
            console.error("Error obteniendo los logros del usuario:", error)
            return { statusCode: 500, message: error }
        }

    }
}

const rewardsService = new RewardsService(rewardsRepository, userRepository);
module.exports = rewardsService;
