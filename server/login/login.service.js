const userRepository = require('../user/user.repository');
const historyRepository = require('../history/history.repository');

const jwt = require('jsonwebtoken');


class LoginService {

    constructor(userRepository, historyRepository) {
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
    }

    /* FUNCIONES AUXILIARES */

    emailHasCorrectFormat(email){
        return email.includes("@");
    }

    emailAndPasswordAreComplete(email, password) {
        if(!email || !password){
            return false;
        }

        return true;
    }

    /* FUNCIONES GENERALES */
    
    // Revisar si hay algún usuario con la sesión activa, caso verdadero no se permitirá iniciar sesión de nuevo.
    async checkLoginStatus(tokenFromClient) {
        console.log("Token del cliente", tokenFromClient)
        if (!tokenFromClient || tokenFromClient === 'null' || tokenFromClient === 'undefined') {
            console.log("Sin sesión activa")
            return { statusCode: 204, message: "Sin sesión activa", hasActiveSession: false };
        }

        try {
            const decodedToken = jwt.verify(tokenFromClient, 'supersecret');
            console.log("Con sesión activa")
            return {
                statusCode: 200,
                message: "Sesión activa",
                hasActiveSession: true,
                user: { email: decodedToken.email, nombre: decodedToken.nombre }
            };
        } catch (error) {
            console.log("Con sesión activa, pero con errores")
            return { statusCode: 204, message: "Token inválido", hasActiveSession: false };
        }
    }

    // Gestionar el inicio de sesión
    async loginUser(email, password, plataforma, modelo_dispositivo){
        
        if(!this.emailAndPasswordAreComplete(email, password)){
            return { statusCode: 400, message: "Faltan campos por rellenar." };
        }

        if(!this.emailHasCorrectFormat(email)){
            return { statusCode: 400, message: "El email introducido no es válido." };
        }

        try {
            const userToLogIn = await userRepository.findUserByEmailAndPassword(email, password);
            if(!userToLogIn){
                return { statusCode: 400, message: "Email o contraseña no son correctos." };
            }

            const token = jwt.sign({
                nombre: userToLogIn.nombre, 
                email: userToLogIn.email, 
                sessionId: Date.now() + Math.random()
            }, 'supersecret', {expiresIn: 3600});

            // Crear un registro en el historial
            console.log("Creando fila de inicio de sesión en el historial...");
            const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            //const plataforma = String(Platform.OS);
            //const modelo = String(Device.modelName);

            const description = `Inicio de sesión de ${userToLogIn.nombre} (${userToLogIn.email}) desde ${plataforma} en el dispositivo ${modelo_dispositivo}`;

            const historyRow = await historyRepository.insertHistoryRecord(userToLogIn.id, 'Login', timestamp, description, plataforma, modelo_dispositivo);

            return { 
                statusCode: 201, 
                message: token 
            };
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return { statusCode: 500, message: error }
        }

        
        
    }
}

const loginService = new LoginService(userRepository, historyRepository)
module.exports = loginService
