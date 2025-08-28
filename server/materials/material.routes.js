const express = require('express');
const materialController = require('./material.controller');

class MaterialRoutes {
    constructor() {
        this.router = express.Router();
        this.initMaterialRoutes();
    }

    initMaterialRoutes() {
        this.router.get('/:id', materialController.getMaterialOfActivity);
    }

    getRouter() {
        return this.router;
    }
}

module.exports = MaterialRoutes;