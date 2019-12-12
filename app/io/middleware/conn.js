'use strict';

const fs = require('fs');
const moment = require('tic-lib').moment.zhCN;

module.exports = app => {
    return async (ctx, next) => {
        /**
         * 1. 检查服务是否存在，不存在即创建
         * 2. 服务状态变更
         * 3. 连接记录
         * 4. 离线指令
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
                state: 1,
                socketId: ctx.socket.id
            });
        } else {
            await service.update({ state: 1, socketId: ctx.socket.id }); // 状态置为可用
        }
        const connRecord = await ctx.model.ServiceConnRecord.create({
            sid: service.id,
            conntime: moment().format('YYYY-MM-DD HH:mm:ss') // 连接时间
        });
        if (!fs.existsSync(`./app/logs/${serviceName}`)) {
            fs.mkdirSync(`./app/logs/${serviceName}`);
        }
        const { offlineMsg } = ctx.config.redisKeys;
        let instructions = await app.redis.hget(offlineMsg, service.id);
        if (instructions) {
            instructions = instructions.split(',');
            for (const i of instructions) {
                app.dio.to(service.socketId).emit(i);
            }
            await app.redis.hdel(offlineMsg, service.id);
        }

        await next();

        // execute when disconnect.
        await service.update({ state: 0 }); // 状态置为不可用
        connRecord.disconntime = moment().format('YYYY-MM-DD HH:mm:ss'); // 断开连接时间
        await connRecord.save();
    };
};
