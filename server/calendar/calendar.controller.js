class CalendarController {

    constructor() {

    }

    async getRoutinesOfDay(req, res) {
        const date = req.params.date;
        const token = req.headers.authorization?.split(' ')[1];
        const data = []; // This should be replaced with actual logic to fetch routines based on the date and user token.
        res.status(data.statusCode).json(data.message);
    }
 
}

const calendarController = new CalendarController();
module.exports = calendarController;