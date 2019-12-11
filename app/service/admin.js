'use strict';

const { BaseService } = require('tic-lib').context;

class AdminService extends BaseService {
    /**
     * 发送指令
     * @param {int} sid service id
     * @param {string} instructions 指令
     */
    async sendInstructions(sid, instructions) {
        const { ctx, app, config } = this;
        const { offlineMsg } = config.redisKeys;
        const receiver = await ctx.model.service.findByPk(sid);
        if (!receiver.state) { // 离线状态
            const old = await app.redis.hget(offlineMsg, sid);
            if (old) {
                instructions = old + ',' + instructions;
            }
            await app.redis.hset(offlineMsg, sid, instructions);
        } else {
            app.dio.to(receiver.socketId).emit('instructions', instructions);
        }
        return receiver.state;
    }
}

module.exports = AdminService;
