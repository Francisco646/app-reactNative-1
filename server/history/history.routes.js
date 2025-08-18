const express = require('express');
const historyController = require('./history.controller');

class HistoryRoutes {
    constructor() {
        this.router = express.Router();
        this.initHistoryRoutes();
    }

    initHistoryRoutes() {
        this.router.get('/user', historyController.getUserHistory);
        this.router.post('/record', historyController.insertHistoryRecord);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = HistoryRoutes;