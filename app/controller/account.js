'use strict';

const { BaseController } = require('tic-lib').context;

class AccountController extends BaseController {
    /**
     * 注册账号
     */
    async register() {
        const { ctx, service, config } = this;
        ctx.validate(config.rules.register);
        const { loginName, loginPass, role } = ctx.request.body;
        await service.account.register(loginName, loginPass, role);
        ctx.successful('注册成功', { isData: false });
    }
    /**
     * 登录
     */
    async login() {
        const { ctx, service, config } = this;
        ctx.validate(config.rules.login);
        const { loginName, loginPass } = ctx.request.body;
        const data = await service.account.login(loginName, loginPass);
        ctx.successful(data);
    }
    /**
     * 获取登录信息
     */
    async self() {
        const { ctx } = this;
        const { loginName, role } = ctx.account;
        ctx.successful({
            loginName,
            role
        });
    }
    /**
     * 列表
     */
    async list() {
        const { ctx, service } = this;
        const data = await service.account.list();
        ctx.successful(data);
    }
}

module.exports = AccountController;
