'use strict';

const { BaseController } = require('tic-lib').context;

class LogsController extends BaseController {
    /**
     * 获取目录
     */
    async dir() {
        const { ctx, service } = this;
        const data = await service.logs.dir();
        ctx.successful(data);
    }
    /**
     * 读取日志
     */
    async readLog() {
        const { ctx, service } = this;
        const { path } = ctx.query;
        const data = await service.logs.readLog(path);
        ctx.successful(data);
    }
}

module.exports = LogsController;
