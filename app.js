'use strict';

const fs = require('fs');
const randomString = require('random-string');

class AppBootHook {
    constructor(app) {
        this.app = app;
    }

    async willReady() {
        const { app } = this;
        if (!fs.existsSync('./app/logs')) { // 日志归档目录
            fs.mkdirSync('./app/logs');
        }
        const salt = randomString({ length: 6 });
        const loginPass = app.hmac('123456', salt);
        await app.model.Account.findOrCreate({ // 创建超级管理员
            where: {
                role: 'root'
            },
            defaults: {
                loginName: 'root',
                loginPass,
                salt,
                role: 'root'
            }
        });
    }
}

module.exports = AppBootHook;
