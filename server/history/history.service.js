const historyRepository = require('./history.repository');
const userRepository = require('../user/user.repository');

const jwt = require('jsonwebtoken');


class HistoryService {

    constructor(historyRepository, userRepository) {
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    /* FUNCIONES AUXILIARES */
    async manageToken(token){

        if(!token || token === null || token === undefined){
            return { error: true, code: 401, message: "Sin sesión activa. No se obtendrá el historial." };
        }

        try {
            const decodedToken = jwt.verify(token, 'supersecret');
            const email = decodedToken.email;

            if(!email) {
                return { error: true, code: 400, message: "No se ha podido obtener el email adecuadamente" };
            }

            const user = await this.userRepository.findUserByEmail(email);
            if(!user) {
                return { error: true, code: 404, message: "No se ha podido encontrar el usuario especificado" };
            }

            return { error: false, userId: user.id };

        } catch(error){
            return { error: true, code: 500, message: error.message };
        }

    }


    /* FUNCIONES GENERALES */

    async getUserHistory(token) {
        
        try {
            
            // Obtener y verificar los datos del token
            const result = await this.manageToken(token);
            if(result.error) return { statusCode: result.code, message: result.message };
            const usuario_id = result.userId;
            
            if (!usuario_id) {
                return { statusCode: 400, message: "El ID del usuario no se ha introducido adecuadamente" };
            }

            const history = await this.historyRepository.getUserHistory(usuario_id);
            if (!history || history.length === 0) {
                return { statusCode: 404, message: "No se ha encontrado el historial del usuario" };
            }

            return { statusCode: 200, message: history };

        } catch(error) {
            console.error('Error en getUserHistory:', error);
            return { statusCode: 500, message: error.message };
        }
        
        
    }

    async insertHistoryRecord(token, accion, plataforma, modelo_dispositivo) {
        
        try{
            
            // Obtener y verificar los datos del token
            const result = await this.manageToken(token);
            if(result.error) return { statusCode: result.code, message: result.message };
            const usuario_id = result.userId;
            
            if (!usuario_id) {
                return { statusCode: 400, message: "El ID del usuario no se ha introducido adecuadamente" };
            }

            if (!accion || typeof accion !== 'string') {
                return { statusCode: 400, message: "La acción no se ha introducido adecuadamente" };
            }

            const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const descripcion = `Acción: ${accion} por el usuario con ID ${usuario_id} desde ${plataforma} en el dispositivo ${modelo_dispositivo}`;
            
            const resultInsert = await this.historyRepository.insertHistoryRecord(usuario_id, accion, timestamp, descripcion, plataforma, modelo_dispositivo);

            return { statusCode: 201, message: resultInsert };

        } catch(error) {
            return { statusCode: 500, message: error.message };
        }
        
        
    }

}

const historyService = new HistoryService(historyRepository, userRepository);
module.exports = historyService;