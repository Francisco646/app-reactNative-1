const rewardService = require('./reward.service')

class RewardController {

    constructor(rewardService) {
        this.rewardService = rewardService
    }

    async getRewardById(req, res){

    }

    async getUserGeneralRewards(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const data = await rewardService.getUserGeneralRewards(token);
        res.status(data.statusCode).json(data.message);
    }

    async getUserSpecificRewards(req, res){
        console.log('Authorization header:', req.headers.authorization);
        const token = req.headers.authorization?.split(' ')[1];
        const data = await rewardService.getUserSpecificRewards(token);
        res.status(data.statusCode).json(data.message);
    }

    async getUserRewardsStats(req, res){
        const token = req.headers.authorization?.split(' ')[1];
        const data = await rewardService.getUserRewardsStats(token)
        res.status(data.statusCode).json(data.message)
    }

}

const rewardController = new RewardController(rewardService)
module.exports = rewardController
