'use strict';

module.exports = () => {
    return async (ctx, next) => {
        const { serviceName, host, port } = ctx.socket.handshake.query;
        const service = await ctx.model.Service.findOne({
            where: {
                name: serviceName,
                host,
                port
            },
            raw: true
        });
        ctx.from = service; // 来源
        ctx.msg = ctx.packet[1]; // 消息实体
        if (ctx.msg.ackId) { // 消息确认
            ctx.socket.emit('arrival', ctx.msg.ackId);
        }
        await next();
    };
};
