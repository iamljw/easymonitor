'use strict';

const { Subscription } = require('egg');
const randomString = require('random-string');
const fs = require('fs');

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
        // ------------ 日志归档目录 ------------
        if (!fs.existsSync('./app/logs')) {
            fs.mkdirSync('./app/logs');
        }
        // ------------ 初始化超级管理员 ------------
        await this.initRoot();
    }
    async initRoot() {
        const { ctx, app, config } = this;
        let { loginName, loginPass } = config.rootAccount;
        const salt = randomString({ length: 6 });
        loginPass = app.hmac(loginPass, salt);
        await ctx.model.Account.findOrCreate({
            where: {
                role: 'root'
            },
            defaults: {
                loginName,
                loginPass,
                salt,
                role: 'root'
            }
        });
    }
}

module.exports = StartupWorker;
