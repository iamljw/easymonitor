'use strict';

module.exports = () => {
    return async (ctx, next) => {
        /**
         * 1. 检查服务是否存在，不存在即创建
         * 2. 服务状态变更
         */
        const { serviceName, host, port, comment } = ctx.socket.handshake.query;
        let service = await ctx.model.Service.findOne({
            where: {
                name: serviceName,
                host,
                port
            }
        });
        if (!service) {
            service = await ctx.model.Service.create({ // 创建服务
                name: serviceName,
                host,
                port,
                comment,
                state: 1
            });
        } else {
            await service.update({ state: 1 }); // 状态置为可用
        }

        await next();

        // execute when disconnect.
        await service.update({ state: 0 }); // 状态置为不可用
    };
};
