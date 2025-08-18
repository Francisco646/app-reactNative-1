const express = require('express');
const routinesController = require('./routines.controller');

class RoutinesRoutes {

    constructor() {
        this.router = express.Router();
        this.initRoutinesRoutes();
    }

    initRoutinesRoutes() {
        this.router.get('/', routinesController.getRoutines);
        this.router.post('/start', routinesController.startRoutine);
        this.router.put('/end', routinesController.endRoutine);
        this.router.get('/quantity', routinesController.getNumberOfCompletedRoutines);
    }

    getRouter(){
        return this.router;
    }

}

module.exports = RoutinesRoutes
