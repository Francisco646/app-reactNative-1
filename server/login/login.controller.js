const loginService = require('./login.service')

class LoginController {

    constructor(loginService) {
        this.loginService = loginService
    }

    async doLogin(req, res){
        const receivedData = req.body;

        const loginDetails = await loginService.loginUser(receivedData.email, receivedData.password, receivedData.plataforma, receivedData.modelo_dispositivo);
        res.status(loginDetails.statusCode).json(loginDetails.message);
    }

    async checkLoginStatus(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const result = await loginService.checkLoginStatus(token);
        res.status(result.statusCode).json(result.token);
    }
}

const loginController = new LoginController(loginService)
module.exports = loginController
