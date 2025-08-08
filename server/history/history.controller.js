const historyService = require('./history.service');

class HistoryController {

    constructor(historyService) {
        this.historyService = historyService;
    }

    async getUserHistory(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        const data = await historyService.getUserHistory(token);
        res.status(data.statusCode).json(data.message);
    }

    async insertHistoryRecord(req, res) {
        const token = req.headers.authorization?.split(' ')[1];
        const data = await historyService.insertHistoryRecord(token, req.body.accion, req.body.plataforma, req.body.modelo_dispositivo);
        res.status(data.statusCode).json(data.message);
    }
}

const historyController = new HistoryController(historyService);
module.exports = historyController;