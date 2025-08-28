const parameterService = require('./parameter.service');

class ParameterController {

    constructor(parameterService) {
        this.parameterService = parameterService;
    }

    async getParametersOfUserActivity(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        const { id, parametros_ids } = req.body;

        const result = await this.parameterService.getParametersOfUserActivity(token, id, parametros_ids);
        res.status(result.statusCode).json(result.message);
    }

    async createParameterMeasure(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        const { id, parametro_id, valor } = req.body;

        const result = await this.parameterService.createParameterMeasure(token, id, parametro_id, valor);
        res.status(result.statusCode).json(result.message);
    }

}

const parameterController = new ParameterController(parameterService);
module.exports = parameterController;