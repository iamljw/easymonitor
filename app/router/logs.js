'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    const apiV1 = router.namespace('/api/v1/logs');
    // ------------ 获取目录 ------------√
    apiV1.get('/dir', controller.logs.dir);
    // ------------ 读取日志 ------------√
    apiV1.get('/readLog', controller.logs.readLog);
};
