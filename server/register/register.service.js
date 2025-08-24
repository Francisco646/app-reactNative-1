const userRepository = require('../user/user.repository');
const rewardsService = require('../rewards/reward.service');
const historyRepository = require('../history/history.repository');


class RegisterService {

    constructor(userRepository, rewardsService, historyRepository) {
        this.userRepository = userRepository;
        this.rewardsService = rewardsService;
        this.historyRepository = historyRepository;
    }

    /* FUNCIONES AUXILIARES */

    dataIsComplete(nombre, email, telefono, contrasena, fecha_nacimiento, tipo_enfermedad, fecha_fin_tratamiento){
        return !!(nombre && email && telefono && contrasena && fecha_nacimiento && tipo_enfermedad && fecha_fin_tratamiento);
    }

    emailHasCorrectFormat(email){
        return email.includes("@");
    }

    emailAndPasswordAreComplete(email, password) {
        return !!(email && password);
    }

    async emailOrPhoneAlreadyPresent(email, telefono) {
        const checkUserEmail = await userRepository.findUserByEmail(email);
        const checkUserPhone = await userRepository.findUserByPhoneNumber(telefono);

        return (checkUserEmail || checkUserPhone);
    }

    /* FUNCIONES GENERALES */

    // Pantalla de registro general
    async verifyUserGeneralData(nombre, email, telefono, contrasena, repeticionContrasena){
        if(!this.emailHasCorrectFormat(email)){
            return { statusCode: 400, message: "El email introducido no es válido" };
        }

        if(await this.emailOrPhoneAlreadyPresent(email, telefono)){
            return { statusCode: 409, message: "El usuario ya se encuentra registrado en el sistema"};
        }

        if(contrasena !== repeticionContrasena){
            return { statusCode: 400, message: "Las contraseñas no coindicen, asegúrese de que sean iguales." };
        }

        return { statusCode: 200, message: "User data correct, proceeding to medical data" };
    }

    // Registro completo de datos de usuario, con logros incluidos
    async createUser(nombre, email, telefono, contrasena, fecha_nacimiento, tipo_enfermedad, fecha_fin_tratamiento, plataforma, modelo_dispositivo) {

        if(!this.emailHasCorrectFormat(email)){
            return { statusCode: 400, message: "El email introducido no es válido" };
        }

        if(await this.emailOrPhoneAlreadyPresent(email, telefono)){
            return { statusCode: 409, message: "El usuario ya se encuentra registrado en el sistema"};
        }

        // Revisión logros
        const generalRewards = await rewardsService.getAllGeneralRewards();
        if(generalRewards.statusCode === 404){
            return { statusCode: 404, message: "No se han encontrado logros generales" };
        }

        const specificRewards = await rewardsService.getSpecificRewardsByDisease(tipo_enfermedad);
        if(specificRewards.statusCode === 400){
            return { statusCode: 400, message: "El tipo de enfermedad no se ha introducido adecuadamente" };
        }

        if(specificRewards.statusCode === 404){
            return { statusCode: 404, message: "No se han encontrado logros para la enfermedad introducida" };
        }

        try {

            // Creación de usuario
            const newUser = await userRepository.createUser(nombre, email, telefono, contrasena, fecha_nacimiento, tipo_enfermedad, fecha_fin_tratamiento);
            console.log(newUser.id)

            const newGeneralUser = await userRepository.createGeneralUser(fecha_nacimiento, tipo_enfermedad, fecha_fin_tratamiento, newUser.id);

            const createdUser = {
                id: newUser.id,
                email: newUser.email,
                telefono: newUser.telefono,
                contrasena: newUser.contrasena,
                usuarioGeneralId: newGeneralUser.id,
                fecha_nacimiento: newGeneralUser.fecha_nacimiento,
                tipo_enfermedad: newGeneralUser.tipo_enfermedad,
                fecha_fin_tratamiento: newGeneralUser.fecha_fin_tratamiento,
            };

            // Creación de logros
            let userReward = [];
            let insertedRewards = [];

            console.log("GeneralRewards", generalRewards)
            for(let reward of generalRewards.message){
                userReward = await rewardsService.createUserReward(newUser.id, reward.logro_id, "general");
                insertedRewards.push(userReward);
            }

            console.log("SpecificRewards", specificRewards)
            for(let reward of specificRewards.message){

                // Insertar logros dentro del rango de edad
                const currentDate = new Date();
                const birthDate = createdUser.fecha_nacimiento;
                let age = currentDate.getFullYear() - birthDate.getFullYear();

                if (age > reward.edad_minima && age < reward.edad_maxima) {
                    userReward = await rewardsService.createUserReward(newUser.id, reward.logro_id, "especifico");
                    insertedRewards.push(userReward);
                }
            }

            // Crear un registro en el historial
            console.log("Creando fila de registro de usuario en el historial...");
            const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const descripcion = `Registro de usuario: ${createdUser.nombre} (${createdUser.email}) con ID ${createdUser.id}`;

            const historyRow = await historyRepository.insertHistoryRecord(createdUser.id, 'Registro', timestamp, descripcion, plataforma, modelo_dispositivo);

            return { statusCode: 201, message: { "Usuario" : createdUser , "Logros": insertedRewards} };

        } catch (error){
            console.error('Error al registrar usuario:', error);
            return { statusCode: 500, message: 'Error interno al registrar usuario' };
        }
    }
}



const registerService = new RegisterService(userRepository, rewardsService, historyRepository);
module.exports = registerService
