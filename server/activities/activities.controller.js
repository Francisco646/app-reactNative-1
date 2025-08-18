const activitiesService = require('./activities.service');

class ActivitiesController {

    constructor(activitiesService) {
        this.activitiesService = activitiesService;
    }

    async getActivities(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const routineId = req.query.routineId;
        const actividades = await activitiesService.getActivities(token, routineId);
        res.status(actividades.statusCode).json(actividades.message);
    }

    async setActivityAsCompleted(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const usuarios_actividades_id = req.body.usuarios_actividades_id
        const completedActivity = await activitiesService.setActivityAsCompleted(token, usuarios_actividades_id);
        res.status(completedActivity.statusCode).json(completedActivity.message);
    }

    async getNumberOfCompletedActivities(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const numberOfCompletedActivities = await activitiesService.getNumberOfCompletedActivities(token);
        res.status(numberOfCompletedActivities.statusCode).json(numberOfCompletedActivities.message);
    }

}

const activitiesController = new ActivitiesController(activitiesService);
module.exports = activitiesController;
