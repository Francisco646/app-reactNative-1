const express = require('express');
const calendarController = require('./calendar.controller');

class CalendarRoutes {

    constructor() {
        this.router = express.Router();
        this.initCalendarRoutes();
    }

    initCalendarRoutes() {
        this.router.get('/:date', calendarController.getRoutinesOfDay);
    }
    getRouter() {
        return this.router;
    }
}

module.exports = CalendarRoutes;