'use strict';

const { BaseController } = require('tic-lib').context;
const { version } = require('../../package.json');

class OverviewController extends BaseController {
    /**
     * 获取 Server 版本号
     */
    async getVersion() {
        const { ctx } = this;
        ctx.successful(version);
    }
    /**
     * 图表数据
     */
    async chart() {
        const { ctx, service } = this;
        const { period } = ctx.query;
        const data = await service.overview.chart(period);
        ctx.successful(data);
    }
    /**
     * 请求记录
     */
    async reqList() {
        const { ctx, service } = this;
        const { reqId, sname, path, status, page, size } = ctx.query;
        const ps = this.pageSize(page, size);
        const data = await service.overview.reqList(reqId, sname, path, status, ps.page, ps.size);
        ctx.successful(data);
    }
    /**
     * 标记请求
     */
    async mark() {
        const { ctx, service } = this;
        const { reqId, status, comment } = ctx.request.body;
        await service.overview.mark(reqId, status, comment);
        ctx.successful('ok', { isData: false });
    }
}

module.exports = OverviewController;
