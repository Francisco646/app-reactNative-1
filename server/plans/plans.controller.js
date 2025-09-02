const plansService = require('./plans.service');

class PlansController {

    constructor(plansService) {
        this.plansService = plansService;
    }

    async getAllPlans(req, res){
        const plans = await plansService.getAllPlans();
        res.status(plans.statusCode).json(plans.message);
    }

    async getPlansOfDisease(req, res){
        const tipo_enfermedad = req.query.tipo_enfermedad;
        const plans = await plansService.getPlansOfDisease(tipo_enfermedad);
        res.status(plans.statusCode).json(plans.message);
    }

    async getPlansByAgeRange(req, res){
        const edad_minima = req.query.edad_minima;
        const edad_maxima = req.query.edad_maxima;
        const plans = await plansService.getPlansByAgeRange(edad_minima, edad_maxima);
        res.status(plans.statusCode).json(plans.message);
    }

    async getPlansByDiseaseAndAge(req, res) {
        const tipo_enfermedad = req.query.tipo_enfermedad;
        const edad_minima = req.query.edad_minima;
        const edad_maxima = req.query.edad_maxima;

        const num_edad_minima = parseInt(edad_minima, 10);
        const num_edad_maxima = parseInt(edad_maxima, 10);

        const plans = await plansService.getPlansByDiseaseAndAge(tipo_enfermedad, num_edad_minima, num_edad_maxima);
        res.status(plans.statusCode).json(plans.message);
    }

    async getPlansOfUser(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const plans = await plansService.getPlansOfUser(token);
        res.status(plans.statusCode).json(plans.message);
    }

    async createUserPlan(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const planId = req.body.planId;

        const createdPlan = await plansService.createUserPlan(token, planId);
        res.status(createdPlan.statusCode).json(createdPlan.message);
    }

    async deleteUserPlan(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const planId = req.body.planId;

        const deletedPlan = await plansService.deleteUserPlan(token, planId);
        res.status(deletedPlan.statusCode).json(deletedPlan.message);
    }

    async updatePercentageCompletedUserPlan(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const id = req.body.id;
        const porcetaje_completado = req.body.porcentaje_completado;

        const updatedPlan = await plansService.updatePercentageCompletedUserPlan(token, id, porcetaje_completado);
        res.status(updatedPlan.statusCode).json(updatedPlan.message);
    }

    async updateEndDateUserPlan(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const id = req.body.id;

        const updatedPlan = await plansService.updateEndDateUserPlan(token, id);
        res.status(updatedPlan.statusCode).json(updatedPlan.message);
    }

}

const plansController = new PlansController(plansService);
module.exports = plansController;
