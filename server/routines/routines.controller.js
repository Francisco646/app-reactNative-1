const routinesService = require('./routines.service');

class RoutinesController {

    constructor(routinesService) {
        this.routinesService = routinesService;
    }

    async getRoutines(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const planId = req.body.planId;
        const routines = await routinesService.getRoutines(token, planId);
        res.status(routines.statusCode).json(routines.message);
    }

}

const routinesController = new RoutinesController(routinesService);
module.exports = routinesController;
