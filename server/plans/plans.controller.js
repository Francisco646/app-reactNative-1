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
        const tipo_enfermedad = req.body.tipo_enfermedad;
        const plans = await plansService.getPlansOfDisease(tipo_enfermedad);
        res.status(plans.statusCode).json(plans.message);
    }

    async getPlansOfUser(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const plans = await plansService.getPlansOfUser(token);
        res.status(plans.statusCode).json(plans.message);
    }

}

const plansController = new PlansController(plansService);
module.exports = plansController;
