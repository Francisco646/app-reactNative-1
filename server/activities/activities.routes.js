const express = require('express');
const activitiesController = require('./activities.controller');

class ActivitiesRoutes {

    constructor() {
        this.router = express.Router();
        this.initActivitiesRoutes()
    }

    initActivitiesRoutes() {
        this.router.get('/', activitiesController.getActivities);
        this.router.put('/completion', activitiesController.setActivityAsCompleted);
        this.router.get('/quantity', activitiesController.getNumberOfCompletedActivities);
        this.router.get('/current', activitiesController.getActivitiesOfCurrentRoutine);
    }

    getRouter() {
        return this.router
    }

}

module.exports = ActivitiesRoutes
