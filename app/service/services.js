'use strict';

const { BaseService } = require('tic-lib').context;

class ServicesService extends BaseService {
    /**
     * 列表
     * @param {string} kw 关键词
     */
    async list(kw) {
        const { ctx, app } = this;
        const { Op } = app.Sequelize;
        const opts = {};
        if (kw) {
            opts[Op.or] = [
                {
                    id: {
                        [Op.like]: `%${kw}%`
                    }
                },
                {
                    name: {
                        [Op.like]: `%${kw}%`
                    }
                }
            ];
        }
        const res = await ctx.model.Service.findAndCountAll({
            where: opts,
            raw: true
        });
        return res;
    }
    /**
     * 访问记录
     * @param {int} sid 服务id
     * @param {int} page page
     * @param {int} size size
     */
    async getAccessLog(sid, page = 1, size = 10) {
        const { ctx } = this;
        const res = await ctx.model.ServiceConnRecord.findAndCountAll({
            offset: page - 1 < 0 ? 0 : (page - 1) * size,
            limit: size,
            order: [
                ['conntime', 'desc']
            ],
            where: {
                sid
            },
            raw: true
        });
        res.sid = sid;
        return res;
    }
}

module.exports = ServicesService;
