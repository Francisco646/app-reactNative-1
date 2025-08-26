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
        const usuario_rutina_id = req.body.usuario_rutina_id
        const actividad_id = req.body.actividad_id
        const plataforma = req.body.plataforma
        const modelo_dispositivo = req.body.modelo_dispositivo

        const completedActivity = await activitiesService.setActivityAsCompleted(token, usuario_rutina_id, actividad_id, plataforma, modelo_dispositivo);
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
