'use strict';

const { BaseService } = require('tic-lib').context;
const fs = require('fs');
const path = require('path');

class LogsService extends BaseService {
    /**
     * 获取目录
     */
    async dir() {
        const res = [];
        const dir0 = fs.readdirSync('app/logs');
        for (const dirname of dir0) {
            const elem = {
                title: dirname,
                children: [
                    {
                        title: 'common'
                    },
                    {
                        title: 'error'
                    }
                ]
            };
            const commonlogs = fs.readdirSync(`app/logs/${dirname}/common`);
            elem.children[0].children = commonlogs.map(item => {
                return {
                    title: item,
                    isFile: true,
                    path: path.join(dirname, 'common', item)
                };
            });
            const errorlogs = fs.readdirSync(`app/logs/${dirname}/error`);
            elem.children[1].children = errorlogs.map(item => {
                return {
                    title: item,
                    isFile: true,
                    path: path.join(dirname, 'error', item)
                };
            });
            res.push(elem);
        }
    }
    /**
     * 读取日志
     * @param {string} path 文件路径
     */
    async readLog(path) {
        const res = fs.readFileSync(path.join('app/logs', path), 'utf8');
        return res;
    }
}

module.exports = LogsService;
