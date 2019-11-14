'use strict';

const { Subscription } = require('egg');

class StartupWorker extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            immediate: true,
            type: 'worker' // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的。
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const { ctx, app } = this;
        // ------------ 将model同步到数据库 ------------
        await app.model.sync();
        // ------------ 重置服务状态 ------------
        await ctx.model.Service.update({
            state: 0
        }, {
            where: {
                state: 1
            }
        });
    }
}

module.exports = StartupWorker;
