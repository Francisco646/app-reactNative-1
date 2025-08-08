const express = require('express')
const registerController = require('./register.controller')

class RegisterRoutes {

    constructor() {
        this.router = express.Router()
        this.initRegisterRoutes()
    }

    initRegisterRoutes(){
        this.router.post('/general', registerController.registerGeneralData);
        this.router.post('/medical', registerController.registerFullData);
    }

    getRouter(){
        return this.router
    }

}

module.exports = RegisterRoutes
