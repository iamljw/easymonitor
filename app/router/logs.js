'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    const apiV1 = router.namespace('/api/v1/logs');
};
