/* eslint valid-jsdoc: "off" */

'use strict';

const { dateFormat } = require('tic-lib');
const {
    clientError: { ClientError },
    resourceError: { ResourceError }
} = require('tic-lib');
const privilege = require('./privilege');
const rules = require('./rules');
const sql = require('./sql');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1572159424111_6833';

    // add your middleware config here
    config.middleware = ['auth'];

    config.auth = {
        enable: true,
        ignore(ctx) {
            const urlpath = ctx.request.url;
            const interfaces = [
                '/account/login'
            ];
            const arg = interfaces.reduce((a, b) => a + `|(^/api/v1${b}$)`, '(^/$)');
            const reg = new RegExp(arg);
            return reg.test(urlpath);
        }
    };

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
        // cluster
        cluster: {
            listen: {
                port: 6300,
                hostname: '0.0.0.0'
            }
        },
        // sequelize
        sequelize: {
            dialect: 'mysql',
            host: '127.0.0.1',
            port: 3306,
            username: 'root',
            password: '123456',
            charset: 'utf8',
            database: 'easymonitor',
            define: {
                freezeTableName: true,
                paranoid: false,
                hooks: {
                    afterFind: dateFormat
                }
            },
            pool: {
                min: 2,
                max: 3,
                acquire: 30000,
                idle: 10000
            },
            timezone: '+08:00',
            logging: false
        },
        // socket.io
        io: {
            init: {},
            namespace: {
                '/': {
                    connectionMiddleware: ['conn'],
                    packetMiddleware: ['packet']
                }
            },
            redis: {
                host: '127.0.0.1',
                port: 6379,
                auth_pass: null,
                db: 10
            }
        },
        redis: {
            client: {
                port: 6379,
                host: '127.0.0.1',
                password: null,
                db: 0
            }
        },
        redisKeys: {
            offlineMsg: 'offlineMsg' // 离线消息
        },
        consul: {
            server: {
                host: '127.0.0.1', // 注册中心ip地址
                port: 8500 // 注册中心端口号
            },
            services: [], // 服务发现列表
            register: true, // 是否注册当前模块，默认为false
            multiInstance: false, // 多实例模式开关，默认为false，注意当开启多实例，务必保证集群中的每个项目的keys不同，或者会导致先启动的项目被隔离(被覆盖)
            name: 'easymonitor', // 注册id
            tags: ['监管服务'], // 标签信息
            check: {
                http: 'http://127.0.0.1:6300', // 健康检测地址
                interval: '5s', // 健康检测间隔
                notes: 'http service check',
                status: 'critical'
            },
            address: '127.0.0.1', // 当前模块的注册地址
            port: 6300 // 当前模块的注册端口号
        },
        security: {
            csrf: {
                enable: false,
                ignoreJSON: true
            },
            domainWhiteList: ['', '127.0.0.1', '0.0.0.0']
        },
        secret: 'Dpj985dHt5wLaAbIz1PpaEZKP1ApUXat',
        rootAccount: {
            loginName: 'root',
            loginPass: '123456'
        },
        // egg-error-handler
        errorHandler2: {
            protection: true,
            tips: '系统繁忙或者正在维护中，请稍后重试',
            ignore: [ClientError, ResourceError]
        }
    };

    return {
        ...config,
        ...userConfig,
        privilege,
        rules,
        sql
    };
};
