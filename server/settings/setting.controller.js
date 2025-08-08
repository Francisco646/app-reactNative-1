const settingService = require('./setting.service')

class SettingController {

    constructor(settingService) {
        this.settingService = settingService;
    }

    async getUserData(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const result = await settingService.getUserData(token);
        res.status(result.statusCode).json(result.message);
    }

    async updateUserPassword(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const payload = req.body;
        const updatedUser = await settingService.updateUserPassword(token, payload.password);
        res.status(updatedUser.statusCode).json(updatedUser.message);
    }

    async updateUserPhone(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const payload = req.body;
        const updatedUser = await settingService.updateUserPhone(token, payload.telefono);
        res.status(updatedUser.statusCode).json(updatedUser.message);
    }

    async updateUserEmail(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const payload = req.body;
        const updatedUser = await settingService.updateUserEmail(token, payload.email);
        res.status(updatedUser.statusCode).json(updatedUser.message);
    }
}

const settingController = new SettingController(settingService)
module.exports = settingController
