const materialService = require('./material.service');

class MaterialController {

    constructor(materialService) {
        this.materialService = materialService;
    }

    async getMaterialOfActivity(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        const actividad_id = req.params.id;

        const result = await materialService.getMaterialOfActivity(token, actividad_id);
        return res.status(result.statusCode).json(result);
    }

}

const materialController = new MaterialController(materialService);
module.exports = materialController;
