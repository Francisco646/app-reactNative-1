const materialRepository = require('./material.repository');
const userRepository = require('../user/user.repository');
const jwt = require('jsonwebtoken');

class MaterialService {

    constructor(materialRepository, userRepository) {
        this.materialRepository = materialRepository;
        this.userRepository = userRepository;
    }

    async getMaterialOfActivity(token, actividad_id) {
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

            const materialOfActivity = await materialRepository.getMaterialByActivityId(actividad_id);
            if(!materialOfActivity) {
                return { statusCode: 404, message: 'No se han encontrado materiales para la actividad.' };
            }

            //console.log(materialOfActivity);

            const material = await materialRepository.getMaterialById(materialOfActivity.material_id);
            return { statusCode: 200, message: material };

        } catch(error) {
            console.error('Error al obtener los materiales de la actividad:', error);
            return { statusCode: 500, message: 'Error interno del servidor.' };
        }
    }

}

const materialService = new MaterialService(materialRepository, userRepository);
module.exports = materialService;