'use strict';

const log4js = require('log4js');
const moment = require('tic-lib').moment.zhCN;

module.exports = app => {
    class LogsController extends app.Controller {
        /**
         * 记录日志
         */
        async log() {
            const { ctx } = this;
            const {
                name, host, port
            } = ctx.from; // 来源
            const filename = `./app/logs/${name}/${name}.log.${moment().format('YYYY-MM-DD')}`;
            const logger = this.getLogger(name, host, port, filename);
            logger[ctx.msg.level](ctx.msg.content);
        }
        getLogger(serviceName, host, port, filename) {
            log4js.configure({
                appenders: {
                    fileAppender: {
                        type: 'file',
                        filename,
                        layout: {
                            type: 'pattern',
                            pattern: `%d{yyyy/MM/dd hh:mm:ss}[%p] ${serviceName}@${host}:${port}: %m`
                        }
                    },
                    console: {
                        type: 'console',
                        layout: {
                            type: 'pattern',
                            pattern: `%d{yyyy/MM/dd hh:mm:ss}[%p] ${serviceName}@${host}:${port}: %m`
                        }
                    }
                },
                categories: {
                    default: { appenders: ['fileAppender', 'console'], level: 'info' }
                }
            });
            return log4js.getLogger();
        }
    }
    return LogsController;
};
