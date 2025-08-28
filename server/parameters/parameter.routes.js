const express = require('express');
const parameterController = require('./parameter.controller');

class ParameterRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/', parameterController.getParametersOfUserActivity);
        this.router.post('/measure', parameterController.createParameterMeasure);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ParameterRoutes;