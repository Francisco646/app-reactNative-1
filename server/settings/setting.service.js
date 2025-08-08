const userRepository = require('../user/user.repository')
const jwt = require('jsonwebtoken')

class SettingService{

    constructor(userRepository) {
        this.userRepository = userRepository
    }

    /* FUNCIONES AUXILIARES */

    /* FUNCIONES GENERALES */

    async getUserData(tokenFromClient){
        
        console.log("Token del cliente", tokenFromClient)
        if (!tokenFromClient || tokenFromClient === 'null' || tokenFromClient === 'undefined') {
            return { statusCode: 401, message: "Sin sesión activa. No se accede a ajustes de usuario."};
        }

        try {
            const decodedToken = jwt.verify(tokenFromClient, 'supersecret');
            const email = decodedToken.email;
            
            if(!email){
                return { statusCode: 400, message: "No se ha recibido el email adecuadamente" };
            }

            const user = await userRepository.findUserByEmail(email);
            if(!user){
                return { statusCode: 404, message: "No se ha encontrado el usuario solicitado" };
            }

            if(email !== user.email){
                return { statusCode: 403, message: "No tienes permiso para acceder a este recurso" };
            }

            const userId = user.id
            const generalUser = await userRepository.findGeneralUser(userId)

            return {
                statusCode: 200,
                message: {
                    nombre: user.nombre,
                    email: user.email,
                    telefono: user.telefono,
                    fecha_nacimiento: generalUser.fecha_nacimiento,
                    tipo_enfermedad: generalUser.tipo_enfermedad,
                    fecha_fin_tratamiento: generalUser.fecha_fin_tratamiento
                }
            }
        } catch (error) {
            console.error("Error obteniendo los datos de usuario:", error)
            return { statusCode: 500, message: error }
        }
    }

    // Actualizar la contraseña del usuario
    async updateUserPassword(token, password) {
        
        console.log("Token del cliente", token)
        if (!token || token === 'null' || token === 'undefined') {
            return { statusCode: 401, message: "Sin sesión activa. No se accede a cambio de contraseña."};
        }

        try {
            
            const decodedToken = jwt.verify(token, 'supersecret');
            const email = decodedToken.email

            const user = await userRepository.findUserByEmail(email);
            if(!user){
                return { statusCode: 404, message: "No se ha encontrado el usuario solicitado." }
            }

            if(email !== user.email){
                return { statusCode: 403, message: "No tienes permisos para acceder a este recurso." };
            }

            if(password === user.contrasena){
                return { statusCode: 409, message: "La contraseña ya está en uso. Introduzca otra diferente." };
            }
            
            if(!password){
                return { statusCode: 400, message: "Por favor, introduzca una contraseña." };
            }

            if(password.length < 4) {
                return { statusCode: 400, message: "Por favor, introduzca una contraseña de al menos 4 caracteres." };
            }

            const updatedUser = userRepository.updateUserPassword(user.id, password);
            return { statusCode: 200, message: updatedUser };

        } catch (error) {
            console.error("Error cambiando la contraseña del usuario:", error)
            return { statusCode: 500, message: error }
        }
    }

    async updateUserPhone(token, telefono){
        console.log("Token del cliente", token)
        if (!token || token === 'null' || token === 'undefined') {
            return { statusCode: 401, message: "Sin sesión activa. No se cambiará el número de teléfono."};
        }

        try {
            const decodedToken = jwt.verify(token, 'supersecret');
            const email = decodedToken.email;

            const user = await userRepository.findUserByEmail(email);
            if(!user){
                return { statusCode: 404, message: "No se ha encontrado el usuario solicitado." };
            }

            if(email !== user.email){
                return { statusCode: 403, message: "No tienes permisos para acceder a este recurso." };
            }

            if(!telefono){
                return { statusCode: 400, message: "Por favor, introduzca un número de teléfono." };
            }

            if(telefono === user.telefono){
                return { statusCode: 409, message: "Ha introducido el mismo teléfono. Introduzca otro diferente." };
            }

            const phoneAddresses = await userRepository.findAllPhoneNumbers();
            if(telefono in phoneAddresses) {
                return { statusCode: 409, message: "Otro usuario ya tiene ese número. Introduzca otro diferente." };
            }

            const updatedUser = await userRepository.updateUserPhone(telefono, user.id);
            return { statusCode: 200, message: updatedUser };

        } catch (error) {
            console.error("Error cambiando el teléfono del usuario:", error)
            return { statusCode: 500, message: error }
        }
    }

    async updateUserEmail(token, userEmail){
        console.log("Token del cliente", token)
        if (!token || token === 'null' || token === 'undefined') {
            return { statusCode: 401, message: "Sin sesión activa. No se cambiará el número de teléfono."};
        }

        try {
            const decodedToken = jwt.verify(token, 'supersecret');
            const email = decodedToken.email;

            const user = await userRepository.findUserByEmail(email);
            if(!user){
                return { statusCode: 404, message: "No se ha encontrado el usuario solicitado." };
            }

            if(email !== user.email){
                return { statusCode: 403, message: "No tienes permisos para acceder a este recurso." };
            }

            if(!userEmail){
                return { statusCode: 400, message: "Por favor, introduzca un número de teléfono." };
            }

            if(userEmail === user.email){
                return { statusCode: 409, message: "Ha introducido el mismo email. Introduzca otro diferente." };
            }

            const emailAddresses = await userRepository.findAllEmailAddresses()
            if(userEmail in emailAddresses){
                return { statusCode: 409, message: "Otro usuario ya tiene ese email. Introduzca otro diferente." };
            }

            const updatedUser = await userRepository.updateUserEmail(userEmail, user.id);
            return { statusCode: 200, message: updatedUser };
            
        } catch (error) {
            console.error("Error cambiando el email del usuario:", error)
            return { statusCode: 500, message: error }
        }
    }

}

const settingService = new SettingService(userRepository)
module.exports = settingService
