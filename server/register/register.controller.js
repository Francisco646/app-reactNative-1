const registerService = require('./register.service')

class RegisterController {
    constructor(registerService) {
        this.registerService = registerService
    }

    async registerGeneralData(req, res){
        const receivedData = req.body

        const verifiedUserData = await registerService.verifyUserGeneralData(
            receivedData.name,
            receivedData.email,
            receivedData.phone,
            receivedData.password,
            receivedData.repeatPassword
        )

        res.status(verifiedUserData.statusCode).json(verifiedUserData.message)
    }

    async registerFullData(req, res){
        const receivedData = req.body

        const createdUser = await registerService.createUser(
            receivedData.name,
            receivedData.email,
            receivedData.phone,
            receivedData.password,
            receivedData.birthDay,
            receivedData.selectedDisease,
            receivedData.treatmentEndDay,
            receivedData.plataforma,
            receivedData.modelo_dispositivo
        )

        res.status(createdUser.statusCode).json(createdUser.message)
    }
}

const registerController = new RegisterController(registerService)
module.exports = registerController
