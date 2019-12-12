'use strict';

const jwt = require('jsonwebtoken');
const {
    resourceError: {
        LoginRequiredError,
        PermissionDeniedError
    },
    clientError: { LogonExpirationError }
} = require('tic-lib');
const crypto = require('crypto');


module.exports = () => {
    return async (ctx, next) => {
        const { secret, privilege } = ctx.app.config;
        // ------------ 身份验证 ------------
        const token = ctx.get('Authorization');
        let payload = {};
        try {
            payload = jwt.verify(token, secret);
        } catch (error) {
            throw new LoginRequiredError(error.message);
        }
        if (!payload || !payload.uid) {
            throw new LoginRequiredError();
        }
        const account = await ctx.model.Account.findOne({
            where: {
                id: payload.uid
            },
            raw: true
        });
        if (!account) {
            throw new LoginRequiredError('用户不存在');
        }
        const { loginPass, salt } = account;
        const hash = crypto.createHash('sha1');
        hash.update(loginPass + salt);
        const v = hash.digest('hex');
        if (payload.hash !== v) {
            throw new LogonExpirationError('令牌通行证已失效');
        }
        ctx.uid = payload.uid;
        ctx.account = account;
        // ------------ 接口权限 ------------
        const { url } = ctx.request;
        if (!privilege.common.some(path => url.startsWith(path))) {
            const { role } = ctx.account;
            if (role !== 'root' && !privilege[role].some(path => url.startsWith(path))) {
                throw new PermissionDeniedError();
            }
        }
        await next();
    };
};
