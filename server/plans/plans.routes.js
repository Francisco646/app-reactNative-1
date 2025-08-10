const express = require('express');
const plansController = require('./plans.controller');

class PlansRoutes {
    constructor() {
        this.router = express.Router();
        this.initPlanRoutes();
    }

    initPlanRoutes() {
        this.router.get('/', plansController.getAllPlans);
        this.router.get('/user-plan', plansController.getPlansOfUser);
        this.router.get('/disease-plan', plansController.getPlansOfDisease);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = PlansRoutes
