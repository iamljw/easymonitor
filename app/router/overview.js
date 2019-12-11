'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    const apiV1 = router.namespace('/api/v1/overview');
    // ------------ 获取 Server 版本号 ------------√
    apiV1.get('/version', controller.overview.getVersion);
    // ------------ 图表数据 ------------√
    apiV1.get('/chart', controller.overview.chart);
    // ------------ 请求记录 ------------√
    apiV1.get('/reqList', controller.overview.reqList);
    // ------------ 标记请求 ------------√
    apiV1.post('/mark', controller.overview.mark);
};
