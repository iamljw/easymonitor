'use strict';

const { BaseService } = require('tic-lib').context;
const moment = require('tic-lib').moment.zhCN;

class OverviewService extends BaseService {
    /**
     * 图表数据
     * @param {string} period 时段 24hour lastMonth halfYear
     * - 折线图
     *      1. avgRes 平均响应时长(ms)
     *      2. total 总请求次数
     *      3. timeout 超时响应次数
     *      4. error 错误请求次数
     *      5. dt 日期
     * - 饼图
     *      1. running 运行服务
     *      2. normal 正常
     *      3. abnormal 异常
     *      4. serviceName 服务名
     *      5. count 请求次数
     */
    async chart(period) {
        const { ctx, config } = this;
        const {
            countTotal,
            countBySatus,
            avgRes: avgResql,
            countBySname
        } = config.sql;
        // ------------ line ------------
        const lineData = {};
        let afterTime;
        let dateFormat;
        let displayFormat;
        switch (period) {
            case 'lastMonth':
                afterTime = moment().startOf('days').subtract(29, 'days')
                    .format('YYYY-MM-DD HH:mm:ss');
                dateFormat = '%Y-%m-%d';
                displayFormat = '%m/%d';
                break;
            case 'halfYear':
                afterTime = moment().startOf('months').subtract(5, 'months')
                    .format('YYYY-MM-DD HH:mm:ss');
                dateFormat = '%Y-%m';
                displayFormat = '%Y/%m';
                break;
            default:
                afterTime = moment().startOf('hours').subtract(23, 'hours')
                    .format('YYYY-MM-DD HH:mm:ss');
                dateFormat = '%H';
        }
        lineData.total = await ctx.model.query(countTotal, { // 总请求次数
            replacements: { displayFormat, dateFormat, afterTime }, type: ctx.model.QueryTypes.SELECT
        });
        lineData.timeout = await ctx.model.query(countBySatus, { // 超时响应次数
            replacements: { displayFormat, dateFormat, afterTime, status: 1 }, type: ctx.model.QueryTypes.SELECT
        });
        lineData.error = await ctx.model.query(countBySatus, { // 错误请求次数
            replacements: { displayFormat, dateFormat, afterTime, status: -1 }, type: ctx.model.QueryTypes.SELECT
        });
        let avgRes = (await ctx.model.query(avgResql, { // 平均响应时长
            replacements: { afterTime }, type: ctx.model.QueryTypes.SELECT
        }))[0].avg;
        avgRes = Math.round(avgRes);
        // ------------ pie ------------
        const running = await ctx.model.Service.count(); // 运行服务
        const normal = await ctx.model.Service.count({ // 正常
            where: {
                state: 1
            }
        });
        const abnormal = await ctx.model.Service.count({ // 异常
            where: {
                state: 0
            }
        });
        const pieData = await ctx.model.query(countBySname, { // 流量占比
            replacements: { afterTime }, type: ctx.model.QueryTypes.SELECT
        });
        return {
            avgRes,
            lineData,
            running,
            normal,
            abnormal,
            pieData
        };
    }
    /**
     * 请求记录
     * @param {int} reqId 请求id
     * @param {string} sname 服务名
     * @param {string} path 请求路径
     * @param {int} status 响应状态
     * @param {int} page page
     * @param {int} size size
     */
    async reqList(reqId, sname, path, status, page = 1, size = 10) {
        const { ctx, app } = this;
        const { Op } = app.Sequelize;
        const opts = {};
        if (reqId) {
            opts.reqId = reqId;
        }
        if (sname) {
            opts.sname = sname;
        }
        if (status) {
            opts.status = status;
        }
        if (path) {
            opts.status = {
                [Op.like]: `%${path}%`
            };
        }
        const res = await ctx.model.TrafficPolicing.findAndCountAll({
            offset: page - 1 < 0 ? 0 : (page - 1) * size,
            limit: size,
            order: [
                ['createdAt', 'desc']
            ],
            where: opts,
            raw: true
        });
        return res;
    }
    /**
     * 标记请求
     * @param {int} reqId 请求id
     * @param {int} status 响应状态
     * @param {string} comment 备注
     */
    async mark(reqId, status, comment) {
        const { ctx } = this;
        await ctx.model.TrafficPolicing.update({
            status,
            comment
        }, {
            where: {
                id: reqId
            }
        });
    }
}

module.exports = OverviewService;
