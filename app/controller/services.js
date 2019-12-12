'use strict';

const { BaseController } = require('tic-lib').context;

class ServicesController extends BaseController {
    /**
     * 列表
     */
    async list() {
        const { ctx, service } = this;
        const data = await service.services.list();
        ctx.successful(data);
    }
    /**
     * 访问记录
     */
    async getAccessLog() {
        const { ctx, service } = this;
        const { sid, page, size } = ctx.query;
        const ps = this.pageSize(page, size);
        const data = await service.services.getAccessLog(sid, ps.page, ps.size);
        ctx.successful(data);
    }
}

module.exports = ServicesController;
