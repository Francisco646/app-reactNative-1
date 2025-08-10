const express = require('express');
const activitiesController = require('./activities.controller');

class ActivitiesRoutes {

    constructor() {
        this.router = express.Router();
        this.initActivitiesRoutes()
    }

    initActivitiesRoutes() {
        this.router.get('/', activitiesController.getActivities)
    }

    getRouter() {
        return this.router
    }

}

module.exports = ActivitiesRoutes
