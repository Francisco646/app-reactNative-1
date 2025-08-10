const express = require('express');
const routinesController = require('./routines.controller');

class RoutinesRoutes {

    constructor() {
        this.router = express.Router();
        this.initRoutinesRoutes();
    }

    initRoutinesRoutes() {
        this.router.get('/', routinesController.getRoutines);
    }

    getRouter(){
        return this.router;
    }

}

module.exports = RoutinesRoutes
