const activitiesService = require('./activities.service');

class ActivitiesController {

    constructor(activitiesService) {
        this.activitiesService = activitiesService;
    }

    async getActivities(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const routineId = req.body.routineId;
        const actividades = await activitiesService.getActivities(token, routineId);
        res.status(actividades.statusCode).json(actividades.message);
    }

}

const activitiesController = new ActivitiesController(activitiesService);
module.exports = activitiesController;
