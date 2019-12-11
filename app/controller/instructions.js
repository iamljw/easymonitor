'use strict';

const { BaseController } = require('tic-lib').context;

class InstructionsController extends BaseController {
    /**
     * 发送指令
     */
    async send() {
        const { ctx, service } = this;
        const { sid, instructions } = ctx.request.body;
        const data = await service.instructions.send(sid, instructions);
        ctx.successful(data);
    }
}

module.exports = InstructionsController;
