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
        this.router.get('/age-plan', plansController.getPlansByAgeRange);
        this.router.get('/disease-age-plan', plansController.getPlansByDiseaseAndAge);
        this.router.post('/new-user-plan', plansController.createUserPlan);
        this.router.delete('/deleted-plan', plansController.deleteUserPlan);
        this.router.put('/user-plan-percentage', plansController.updatePercentageCompletedUserPlan);
        this.router.put('/user-plan-date', plansController.updateEndDateUserPlan);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = PlansRoutes
