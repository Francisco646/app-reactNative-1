const express = require('express')
const rewardController = require('./reward.controller')

class RewardRoutes {

    constructor() {
        this.router = express.Router()
        this.initRewardRoutes()
    }

    initRewardRoutes(){
        this.router.get('/general', rewardController.getUserGeneralRewards)
        this.router.get('/general/:id', rewardController.getRewardById)
        this.router.get('/specific', rewardController.getUserSpecificRewards)
        this.router.get('/specific/:id', rewardController.getRewardById)
        this.router.get('/stats', rewardController.getUserRewardsStats)
    }

    getRouter(){
        return this.router
    }

}

module.exports = RewardRoutes
