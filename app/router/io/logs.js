'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { io } = app;
    const nsp = io.of('/');
    // 记录日志
    nsp.route('log', io.controller.logs.log);
};
