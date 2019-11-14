'use strict';

const jwt = require('jsonwebtoken');
const { LoginRequiredError } = require('tic-lib').resourceError;
const crypto = require('crypto');

module.exports = () => {
    return async (ctx, next) => {
        const token = ctx.get('Authorization');
        const { secret } = ctx.app.config;
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
            throw new LoginRequiredError('令牌通行证已失效');
        }
        ctx.uid = payload.uid;
        ctx.account = account;
        await next();
    };
};
