'use strict';

const { BaseController } = require('tic-lib').context;

class AdminController extends BaseController {
    /**
     * 发送指令
     */
    async sendInstructions() {
        const { ctx, service } = this;
        const { sid, instructions } = ctx.request.body;
        const data = await service.admin.sendInstructions(sid, instructions);
        ctx.successful(data);
    }
}

module.exports = AdminController;
