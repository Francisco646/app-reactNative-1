const express = require('express')
const loginController = require('./login.controller')

class LoginRoutes {

    constructor() {
        this.router = express.Router()
        this.initLoginRoutes()
    }

    initLoginRoutes(){
        this.router.post('/', loginController.doLogin);
        this.router.get('/status', loginController.checkLoginStatus);
    }

    getRouter(){
        return this.router
    }

}

module.exports = LoginRoutes
