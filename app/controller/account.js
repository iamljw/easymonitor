'use strict';

const { BaseController } = require('tic-lib').context;

class AccountController extends BaseController {
    /**
     * 注册
     */
    async register() {
        const { ctx } = this;
        const { loginName, loginPass, role } = ctx.request.body;
    }
}

module.exports = AccountController;
