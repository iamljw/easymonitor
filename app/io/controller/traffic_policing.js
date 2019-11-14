'use strict';

const moment = require('tic-lib').moment.zhCN;

module.exports = app => {
    class TrafficPolicingController extends app.Controller {
        /**
         * 请求
         */
        async request() {
            const { ctx } = this;
            const { from } = ctx; // 来源
            const { customId, method, path, headers, queryStrParams, requestBody } = ctx.msg; // 实体
            await ctx.model.TrafficPolicing.create({
                customId,
                sid: from.id,
                sname: from.name,
                method,
                path,
                headers: JSON.stringify(headers),
                queryStrParams: JSON.stringify(queryStrParams),
                requestBody: JSON.stringify(requestBody)
            });
        }
        /**
         * 响应
         */
        async response() {
            const { ctx } = this;
            const { customId, status, responseBody } = ctx.msg; // 实体
            const trafficPolicing = await ctx.model.TrafficPolicing.findOne({
                where: {
                    customId
                }
            });
            if (trafficPolicing) {
                const costTime = moment().diff(trafficPolicing.createdAt);
                await trafficPolicing.update({
                    status,
                    responseBody: JSON.stringify(responseBody),
                    costTime: costTime - 12 > 0 ? costTime - 12 : costTime
                });
            }
        }
    }
    return TrafficPolicingController;
};
