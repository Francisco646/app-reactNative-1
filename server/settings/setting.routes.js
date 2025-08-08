const express = require('express')
const settingController = require('./setting.controller')

class SettingRoutes {

    constructor() {
        this.router = express.Router()
        this.initSettingRoutes()
    }

    initSettingRoutes(){
        this.router.get('/user', settingController.getUserData);
        this.router.put('/user/change-password', settingController.updateUserPassword);
        this.router.put('/user/change-phone', settingController.updateUserPhone);
        this.router.put('/user/change-email', settingController.updateUserEmail);
    }

    getRouter(){
        return this.router
    }

}

module.exports = SettingRoutes
