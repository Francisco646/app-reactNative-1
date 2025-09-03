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
        const plataforma = req.body.plataforma;
        const modelo_dispositivo = req.body.modelo_dispositivo;

        const endedRoutine = await routinesService.endRoutine(token, usuarios_rutinas_id, porcentaje_completado, plataforma, modelo_dispositivo);
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

    async updatePerformedRoutine(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        const { routineId, dolor, sueño, fatiga, animo, isInitial, usuarios_rutinas_id } = req.body;

        const wellnessTest = await routinesService.createWellnessTest(token, dolor, sueño, fatiga, animo, routineId, isInitial, usuarios_rutinas_id);
        res.status(wellnessTest.statusCode).json(wellnessTest.message);
    }

    async getWellnessTests(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        const wellness_tests_initial_id = req.query.initial_id;
        const wellness_tests_final_id = req.query.final_id;

        const wellnessTest = await routinesService.getWellnessTestsOfRoutine(token, wellness_tests_initial_id, wellness_tests_final_id);
        res.status(wellnessTest.statusCode).json(wellnessTest.message);
    }

}

const routinesController = new RoutinesController(routinesService);
module.exports = routinesController;
