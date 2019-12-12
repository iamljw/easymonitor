'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { io } = app;
    const nsp = io.of('/');
    // 请求
    nsp.route('request', io.controller.trafficPolicing.request);
    // 响应
    nsp.route('response', io.controller.trafficPolicing.response);
};
