'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    const apiV1 = router.namespace('/api/v1/account');
    // ------------ 注册账号 ------------√
    apiV1.post('/register', controller.account.register);
    // ------------ 登录 ------------√
    apiV1.post('/login');
    // ------------ 列表 ------------√
    apiV1.get('/list', controller.account.list);
};
