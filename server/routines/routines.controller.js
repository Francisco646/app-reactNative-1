const routinesService = require('./routines.service');

class RoutinesController {

    constructor(routinesService) {
        this.routinesService = routinesService;
    }

    async getRoutines(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const planId = req.query.planId;

        const routines = await routinesService.getRoutines(token, planId);
        res.status(routines.statusCode).json(routines.message);
    }

    async getRoutineById(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        const routineId = req.params.id;

        const routine = await routinesService.getRoutineById(token, routineId);
        res.status(routine.statusCode).json(routine.message);
    }

    async startRoutine(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const routineId = req.body.routineId;

        const startedRoutine = await routinesService.startRoutine(token, routineId);
        res.status(startedRoutine.statusCode).json(startedRoutine.message);
    }

    async endRoutine(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const usuarios_rutinas_id = req.body.usuarios_rutinas_id;
        const porcentaje_completado = req.body.porcentaje_completado;

        const endedRoutine = await routinesService.endRoutine(token, usuarios_rutinas_id, porcentaje_completado);
        res.status(endedRoutine.statusCode).json(endedRoutine.message);
    }

    async getCurrentRoutine(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        const routineId = req.params.id;

        const currentRoutine = await routinesService.getCurrentRoutine(token, routineId);
        res.status(currentRoutine.statusCode).json(currentRoutine.message);
    }

    async getNumberOfCompletedRoutines(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const numberOfCompletedRoutines = await routinesService.getNumberOfCompletedRoutines(token);
        res.status(numberOfCompletedRoutines.statusCode).json(numberOfCompletedRoutines.message);
    }

    async getRoutinesOfDate(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        const date = req.query.date.split('T')[0];

        const routines = await routinesService.getRoutinesOfDate(token, date);
        res.status(routines.statusCode).json(routines.message);
    }

}

const routinesController = new RoutinesController(routinesService);
module.exports = routinesController;
