'use strict';

const { BaseService } = require('tic-lib').context;
const {
    resourceError: { NotFoundError },
    clientError: {
        ClientError,
        InvalidPasswordError
    }
} = require('tic-lib');
const crypto = require('crypto');
const randomString = require('random-string');
const jwt = require('jsonwebtoken');

class AccountService extends BaseService {
    /**
     * 注册账号
     * @param {string} loginName 登录名
     * @param {string} loginPass 登录密码
     * @param {string} role 账户角色
     */
    async register(loginName, loginPass, role) {
        const { ctx, app } = this;
        const isExist = await ctx.model.Account.count({
            where: {
                loginName
            }
        });
        if (isExist) {
            throw new ClientError('账号已存在');
        }
        const salt = randomString({ length: 6 });
        loginPass = app.hmac(loginPass, salt);
        await ctx.model.Account.create({
            loginName,
            loginPass,
            salt,
            role
        });
    }
    /**
     * 登录
     * @param {string} loginName 登录名
     * @param {string} loginPass 登录密码
     */
    async login(loginName, loginPass) {
        const { ctx, app, config } = this;
        const account = await ctx.model.Account.findOne({
            where: {
                loginName
            }
        });
        if (!loginName) {
            throw new NotFoundError('账号不存在');
        }
        loginPass = app.hmac(loginPass, account.salt);
        if (loginPass !== account.loginPass) {
            throw new InvalidPasswordError();
        }
        // ------------ 签发token ------------
        const { secret } = config;
        const hash = crypto.createHash('sha1');
        hash.update(loginPass + account.salt);
        const v = hash.digest('hex');
        const token = jwt.sign({
            uid: account.id,
            hash: v
        }, secret);
        return {
            loginName,
            role: account.role,
            token
        };
    }
    /**
     * 列表
     */
    async list() {
        const { ctx } = this;
        const res = await ctx.model.Account.findAll({
            attributes: ['id', 'loginName', 'role'],
            raw: true
        });
        return res;
    }
}

module.exports = AccountService;
