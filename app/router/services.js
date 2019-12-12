'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    const apiV1 = router.namespace('/api/v1/services');
    // ------------ 列表 ------------√
    apiV1.get('/list', controller.services.list);
    // ------------ 访问记录 ------------√
    apiV1.get('/accessLog', controller.services.getAccessLog);
};
