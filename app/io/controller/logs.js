'use strict';

module.exports = app => {
    class LogsController extends app.Controller {
        /**
         * 记录日志
         */
        async log() {
            const { ctx } = this;
            const { from } = ctx; // 来源
        }
    }
    return LogsController;
};
